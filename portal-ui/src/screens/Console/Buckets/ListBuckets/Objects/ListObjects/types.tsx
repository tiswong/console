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

export interface BucketObject {
  name: string;
  size: number;
  etag?: string;
  last_modified: Date;
  content_type: string;
  version_id: string;
  delete_flag?: boolean;
}

export interface BucketObjectsList {
  objects: BucketObject[];
  total: number;
}

export interface RewindObject {
  last_modified: string;
  delete_flag: boolean;
  name: string;
  version_id: string;
  size: number;
}

export interface RewindObjectList {
  objects: RewindObject[];
}
