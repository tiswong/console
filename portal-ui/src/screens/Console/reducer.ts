// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import { ISessionResponse } from "./types";
import { RESET_SESSION, SESSION_RESPONSE, SessionActionTypes } from "./actions";

export interface ConsoleState {
  session: ISessionResponse;
}

const initialState: ConsoleState = {
  session: {
    operator: false,
    status: "",
    features: [],
    distributedMode: false,
    permissions: {},
  },
};

export function consoleReducer(
  state = initialState,
  action: SessionActionTypes
): ConsoleState {
  switch (action.type) {
    case SESSION_RESPONSE:
      return {
        ...state,
        session: action.message,
      };
    case RESET_SESSION:
      return {
        ...state,
        session: initialState.session,
      };
    default:
      return state;
  }
}
