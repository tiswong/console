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

import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  containerForHeader,
  spacingUtils,
  tableStyles,
  tenantDetailsStyles,
  textStyleUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../../../actions";
import { AppState } from "../../../../../../store";
import { setTenantDetailsLoad } from "../../../actions";
import { Box } from "@mui/material";
import { ITenant } from "../../../ListTenants/types";
import Grid from "@mui/material/Grid";
import LabelValuePair from "../../../../Common/UsageBarWrapper/LabelValuePair";
import { niceBytesInt } from "../../../../../../common/utils";
import StackRow from "../../../../Common/UsageBarWrapper/StackRow";
import RBIconButton from "../../../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import { EditTenantIcon } from "../../../../../../icons";

interface IPoolDetails {
  classes: any;
  history: any;
  loadingTenant: boolean;
  tenant: ITenant | null;
  selectedPool: string | null;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    ...spacingUtils,
    ...textStyleUtils,
    ...tenantDetailsStyles,
    ...tableStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const stylingLayout = {
  border: "#EAEAEA 1px solid",
  borderRadius: "3px",
  padding: "0px 20px",
  position: "relative",
};

const twoColCssGridLayoutConfig = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
  gridAutoFlow: { xs: "dense", sm: "row" },
  gap: 2,
  padding: "15px",
};

const PoolDetails = ({ tenant, selectedPool, history }: IPoolDetails) => {
  const poolInformation =
    tenant?.pools.find((pool) => pool.name === selectedPool) || null;

  if (poolInformation === null) {
    return null;
  }

  let affinityType = "None";

  if (poolInformation.affinity) {
    if (poolInformation.affinity.nodeAffinity) {
      affinityType = "Node Selector";
    } else {
      affinityType = "Default (Pod Anti-Affinity)";
    }
  }

  const HeaderSection = ({ title }: { title: string }) => {
    return (
      <StackRow
        sx={{
          borderBottom: "1px solid #eaeaea",
          margin: 0,
          marginBottom: "20px",
        }}
      >
        <h3>{title}</h3>
      </StackRow>
    );
  };

  return (
    <Fragment>
      <Grid item xs={12} sx={{ ...stylingLayout }}>
        <div style={{ position: "absolute", right: 20, top: 18 }}>
          <RBIconButton
            icon={<EditTenantIcon />}
            onClick={() => {
              history.push(
                `/namespaces/${tenant?.namespace || ""}/tenants/${
                  tenant?.name || ""
                }/edit-pool`
              );
            }}
            text={"Edit Pool"}
            id={"editPool"}
          />
        </div>
        <HeaderSection title={"Pool Configuration"} />
        <Box sx={{ ...twoColCssGridLayoutConfig }}>
          <LabelValuePair label={"Pool Name"} value={poolInformation.name} />
          <LabelValuePair
            label={"Total Volumes"}
            value={poolInformation.volumes}
          />
          <LabelValuePair
            label={"Volumes per server"}
            value={poolInformation.volumes_per_server}
          />
          <LabelValuePair label={"Capacity"} value={poolInformation.capacity} />
        </Box>
        <HeaderSection title={"Resources"} />
        <Box sx={{ ...twoColCssGridLayoutConfig }}>
          {poolInformation.resources && (
            <Fragment>
              <LabelValuePair
                label={"CPU"}
                value={poolInformation.resources.requests.cpu}
              />
              <LabelValuePair
                label={"Memory"}
                value={niceBytesInt(poolInformation.resources.requests.memory)}
              />
            </Fragment>
          )}
          <LabelValuePair
            label={"Volume Size"}
            value={niceBytesInt(poolInformation.volume_configuration.size)}
          />
          <LabelValuePair
            label={"Storage Class Name"}
            value={poolInformation.volume_configuration.storage_class_name}
          />
        </Box>
        {poolInformation.securityContext &&
          (poolInformation.securityContext.runAsNonRoot ||
            poolInformation.securityContext.runAsUser ||
            poolInformation.securityContext.runAsGroup ||
            poolInformation.securityContext.fsGroup) && (
            <Fragment>
              <HeaderSection title={"Security Context"} />
              <Box>
                {poolInformation.securityContext.runAsNonRoot !== null && (
                  <Box sx={{ ...twoColCssGridLayoutConfig }}>
                    <LabelValuePair
                      label={"Run as Non Root"}
                      value={
                        poolInformation.securityContext.runAsNonRoot
                          ? "Yes"
                          : "No"
                      }
                    />
                  </Box>
                )}
                <Box
                  sx={{
                    ...twoColCssGridLayoutConfig,
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "2fr 1fr",
                      md: "1fr 1fr 1fr",
                    },
                  }}
                >
                  {poolInformation.securityContext.runAsUser && (
                    <LabelValuePair
                      label={"Run as User"}
                      value={poolInformation.securityContext.runAsUser}
                    />
                  )}
                  {poolInformation.securityContext.runAsGroup && (
                    <LabelValuePair
                      label={"Run as Group"}
                      value={poolInformation.securityContext.runAsGroup}
                    />
                  )}
                  {poolInformation.securityContext.fsGroup && (
                    <LabelValuePair
                      label={"FsGroup"}
                      value={poolInformation.securityContext.fsGroup}
                    />
                  )}
                </Box>
              </Box>
            </Fragment>
          )}
        <HeaderSection title={"Affinity"} />
        <Box>
          <Box sx={{ ...twoColCssGridLayoutConfig }}>
            <LabelValuePair label={"Type"} value={affinityType} />
            {poolInformation.affinity?.nodeAffinity &&
            poolInformation.affinity?.podAntiAffinity ? (
              <LabelValuePair label={"With Pod Anti affinity"} value={"Yes"} />
            ) : (
              <span />
            )}
          </Box>
          {poolInformation.affinity?.nodeAffinity && (
            <Fragment>
              <HeaderSection title={"Labels"} />
              <ul>
                {poolInformation.affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.map(
                  (term) => {
                    return term.matchExpressions.map((trm) => {
                      return (
                        <li>
                          {trm.key} - {trm.values.join(", ")}
                        </li>
                      );
                    });
                  }
                )}
              </ul>
            </Fragment>
          )}
        </Box>
        {poolInformation.tolerations && poolInformation.tolerations.length > 0 && (
          <Fragment>
            <HeaderSection title={"Tolerations"} />
            <Box>
              <ul>
                {poolInformation.tolerations.map((tolItem) => {
                  return (
                    <li>
                      {tolItem.operator === "Equal" ? (
                        <Fragment>
                          If <strong>{tolItem.key}</strong> is equal to{" "}
                          <strong>{tolItem.value}</strong> then{" "}
                          <strong>{tolItem.effect}</strong> after{" "}
                          <strong>
                            {tolItem.tolerationSeconds?.seconds || 0}
                          </strong>{" "}
                          seconds
                        </Fragment>
                      ) : (
                        <Fragment>
                          If <strong>{tolItem.key}</strong> exists then{" "}
                          <strong>{tolItem.effect}</strong> after{" "}
                          <strong>
                            {tolItem.tolerationSeconds?.seconds || 0}
                          </strong>{" "}
                          seconds
                        </Fragment>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Box>
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
  selectedPool: state.tenants.tenantDetails.selectedPool,
});
const connector = connect(mapState, {
  setErrorSnackMessage,
  setTenantDetailsLoad,
});

export default withStyles(styles)(connector(PoolDetails));
