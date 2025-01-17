// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState, Fragment } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { Box, Button, Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { setModalErrorSnackMessage } from "../../../../../../actions";
import { AppState } from "../../../../../../store";
import { ErrorResponseHandler } from "../../../../../../common/types";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import api from "../../../../../../common/api";
import { encodeFileName } from "../../../../../../common/utils";
import {
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { TagsIcon } from "../../../../../../icons";
import { IFileInfo } from "./types";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../../../../common/SecureComponent";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";

interface ITagModal {
  modalOpen: boolean;
  bucketName: string;
  actualInfo: IFileInfo;
  onCloseAndUpdate: (refresh: boolean) => void;
  distributedSetup: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    pathLabel: {
      marginTop: 0,
      marginBottom: 32,
    },
    newTileHeader: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
      margin: "20px 0",
      paddingBottom: 15,
      borderBottom: "#E2E2E2 2px solid",
    },
    ...formFieldStyles,
    ...modalStyleUtils,
    ...spacingUtils,
  });

const AddTagModal = ({
  modalOpen,
  onCloseAndUpdate,
  bucketName,
  distributedSetup,
  actualInfo,
  setModalErrorSnackMessage,
  classes,
}: ITagModal) => {
  const [newKey, setNewKey] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [deleteEnabled, setDeleteEnabled] = useState<boolean>(false);
  const [deleteKey, setDeleteKey] = useState<string>("");
  const [deleteLabel, setDeleteLabel] = useState<string>("");

  const selectedObject = encodeFileName(actualInfo.name);
  const currentTags = actualInfo.tags;
  const currTagKeys = Object.keys(currentTags || {});

  const allPathData = actualInfo.name.split("/");
  const currentItem = allPathData.pop() || "";

  const resetForm = () => {
    setNewLabel("");
    setNewKey("");
  };

  const addTagProcess = () => {
    setIsSending(true);
    const newTag: any = {};

    newTag[newKey] = newLabel;
    const newTagList = { ...currentTags, ...newTag };

    const verID = distributedSetup ? actualInfo.version_id : "null";

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/tags?prefix=${selectedObject}&version_id=${verID}`,
        { tags: newTagList }
      )
      .then((res: any) => {
        onCloseAndUpdate(true);
        setIsSending(false);
      })
      .catch((error: ErrorResponseHandler) => {
        setModalErrorSnackMessage(error);
        setIsSending(false);
      });
  };

  const deleteTagProcess = () => {
    const cleanObject: any = { ...currentTags };
    delete cleanObject[deleteKey];

    const verID = distributedSetup ? actualInfo.version_id : "null";

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/tags?prefix=${selectedObject}&version_id=${verID}`,
        { tags: cleanObject }
      )
      .then((res: any) => {
        onCloseAndUpdate(true);
        setIsSending(false);
      })
      .catch((error: ErrorResponseHandler) => {
        setModalErrorSnackMessage(error);
        setIsSending(false);
      });
  };

  const onDeleteTag = (tagKey: string, tag: string) => {
    setDeleteKey(tagKey);
    setDeleteLabel(tag);
    setDeleteEnabled(true);
  };

  const cancelDelete = () => {
    setDeleteKey("");
    setDeleteLabel("");
    setDeleteEnabled(false);
  };

  return (
    <Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title={deleteEnabled ? `Delete Tag` : `Edit Tags for ${currentItem}`}
        onClose={() => {
          onCloseAndUpdate(true);
        }}
        titleIcon={<TagsIcon />}
      >
        {deleteEnabled ? (
          <Fragment>
            <Grid container>
              Are you sure you want to delete the tag{" "}
              <b className={classes.wrapText}>
                {deleteKey} : {deleteLabel}
              </b>{" "}
              from {currentItem}?
              <Grid item xs={12} className={classes.modalButtonBar}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={cancelDelete}
                >
                  No
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
                  color="secondary"
                  onClick={deleteTagProcess}
                >
                  Yes
                </Button>
              </Grid>
            </Grid>
          </Fragment>
        ) : (
          <Grid container>
            <SecureComponent
              scopes={[IAM_SCOPES.S3_GET_OBJECT_TAGGING]}
              resource={bucketName}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                }}
              >
                <strong>Current Tags:</strong>
                {currTagKeys.length === 0 ? "No Tags for this object" : ""}
                <Box>
                  {currTagKeys.map((tagKey: string, index: number) => {
                    const tag = get(currentTags, `${tagKey}`, "");
                    if (tag !== "") {
                      return (
                        <SecureComponent
                          key={`chip-${index}`}
                          scopes={[IAM_SCOPES.S3_DELETE_OBJECT_TAGGING]}
                          resource={bucketName}
                          matchAll
                          errorProps={{
                            deleteIcon: null,
                            onDelete: null,
                          }}
                        >
                          <Chip
                            style={{
                              textTransform: "none",
                              marginRight: "5px",
                            }}
                            size="small"
                            label={`${tagKey} : ${tag}`}
                            color="primary"
                            deleteIcon={<CloseIcon />}
                            onDelete={() => {
                              onDeleteTag(tagKey, tag);
                            }}
                          />
                        </SecureComponent>
                      );
                    }
                    return null;
                  })}
                </Box>
              </Box>
            </SecureComponent>
            <SecureComponent
              scopes={[IAM_SCOPES.S3_PUT_OBJECT_TAGGING]}
              resource={bucketName}
              errorProps={{ disabled: true, onClick: null }}
            >
              <Grid container>
                <Grid item xs={12} className={classes.newTileHeader}>
                  Add New Tag
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    value={newKey}
                    label={"Tag Key"}
                    id={"newTagKey"}
                    name={"newTagKey"}
                    placeholder={"Enter Tag Key"}
                    onChange={(e) => {
                      setNewKey(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    value={newLabel}
                    label={"Tag Label"}
                    id={"newTagLabel"}
                    name={"newTagLabel"}
                    placeholder={"Enter Tag Label"}
                    onChange={(e) => {
                      setNewLabel(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} className={classes.modalButtonBar}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={resetForm}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={
                      newLabel.trim() === "" ||
                      newKey.trim() === "" ||
                      isSending
                    }
                    onClick={addTagProcess}
                  >
                    Save new Tag
                  </Button>
                </Grid>
              </Grid>
            </SecureComponent>
          </Grid>
        )}
      </ModalWrapper>
    </Fragment>
  );
};

const mapStateToProps = ({ system }: AppState) => ({
  distributedSetup: get(system, "distributedSetup", false),
});

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(AddTagModal));
