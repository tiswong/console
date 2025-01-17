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

// These tests are for AdminAPI Tag based on swagger-console.yml

package restapi

import (
	"context"
	"fmt"
	"testing"

	"github.com/minio/madmin-go"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var getSiteReplicationInfo func(ctx context.Context) (*madmin.SiteReplicationInfo, error)

func (ac adminClientMock) getSiteReplicationInfo(ctx context.Context) (*madmin.SiteReplicationInfo, error) {
	return getSiteReplicationInfo(ctx)
}

var addSiteReplicationInfo func(ctx context.Context, sites []madmin.PeerSite) (*madmin.ReplicateAddStatus, error)

func (ac adminClientMock) addSiteReplicationInfo(ctx context.Context, sites []madmin.PeerSite) (*madmin.ReplicateAddStatus, error) {
	return addSiteReplicationInfo(ctx, sites)
}

var editSiteReplicationInfo func(ctx context.Context, site madmin.PeerInfo) (*madmin.ReplicateEditStatus, error)

func (ac adminClientMock) editSiteReplicationInfo(ctx context.Context, site madmin.PeerInfo) (*madmin.ReplicateEditStatus, error) {
	return editSiteReplicationInfo(ctx, site)
}

var deleteSiteReplicationInfoMock func(ctx context.Context, removeReq madmin.SRRemoveReq) (*madmin.ReplicateRemoveStatus, error)

func (ac adminClientMock) deleteSiteReplicationInfo(ctx context.Context, removeReq madmin.SRRemoveReq) (*madmin.ReplicateRemoveStatus, error) {
	return deleteSiteReplicationInfoMock(ctx, removeReq)
}

func TestGetSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := adminClientMock{}

	function := "getSiteReplicationInfo()"
	ctx := context.Background()

	retValueMock := madmin.SiteReplicationInfo{
		Enabled: true,
		Name:    "site1",
		Sites: []madmin.PeerInfo{
			madmin.PeerInfo{
				Endpoint:     "http://localhost:9000",
				Name:         "site1",
				DeploymentID: "12345",
			},
			madmin.PeerInfo{
				Endpoint:     "http://localhost:9001",
				Name:         "site2",
				DeploymentID: "123456",
			},
		},
		ServiceAccountAccessKey: "test-key",
	}

	expValueMock := &madmin.SiteReplicationInfo{
		Enabled: true,
		Name:    "site1",
		Sites: []madmin.PeerInfo{
			madmin.PeerInfo{
				Endpoint:     "http://localhost:9000",
				Name:         "site1",
				DeploymentID: "12345",
			},
			madmin.PeerInfo{
				Endpoint:     "http://localhost:9001",
				Name:         "site2",
				DeploymentID: "123456",
			},
		},
		ServiceAccountAccessKey: "test-key",
	}

	getSiteReplicationInfo = func(ctx context.Context) (info *madmin.SiteReplicationInfo, err error) {
		return &retValueMock, nil
	}

	srInfo, err := adminClient.getSiteReplicationInfo(ctx)

	if err != nil {

	}

	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: length of lists is not the same", function))

}

func TestAddSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := adminClientMock{}

	function := "addSiteReplicationInfo()"
	ctx := context.Background()

	retValueMock := &madmin.ReplicateAddStatus{
		Success:                 true,
		Status:                  "success",
		ErrDetail:               "",
		InitialSyncErrorMessage: "",
	}

	expValueMock := &madmin.ReplicateAddStatus{
		Success:                 true,
		Status:                  "success",
		ErrDetail:               "",
		InitialSyncErrorMessage: "",
	}

	addSiteReplicationInfo = func(ctx context.Context, sites []madmin.PeerSite) (res *madmin.ReplicateAddStatus, err error) {
		return retValueMock, nil
	}

	sites := []madmin.PeerSite{
		madmin.PeerSite{
			Name:      "site1",
			Endpoint:  "http://localhost:9000",
			AccessKey: "test",
			SecretKey: "test",
		},
		madmin.PeerSite{
			Name:      "site2",
			Endpoint:  "http://localhost:9001",
			AccessKey: "test",
			SecretKey: "test",
		},
	}

	srInfo, err := adminClient.addSiteReplicationInfo(ctx, sites)

	if err != nil {

	}

	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: length of lists is not the same", function))

}

func TestEditSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := adminClientMock{}

	function := "editSiteReplicationInfo()"
	ctx := context.Background()

	retValueMock := &madmin.ReplicateEditStatus{
		Success:   true,
		Status:    "success",
		ErrDetail: "",
	}

	expValueMock := &madmin.ReplicateEditStatus{
		Success:   true,
		Status:    "success",
		ErrDetail: "",
	}

	editSiteReplicationInfo = func(ctx context.Context, site madmin.PeerInfo) (res *madmin.ReplicateEditStatus, err error) {
		return retValueMock, nil
	}

	site := madmin.PeerInfo{
		Name:         "",
		Endpoint:     "",
		DeploymentID: "12345",
	}

	srInfo, err := adminClient.editSiteReplicationInfo(ctx, site)

	if err != nil {

	}

	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: length of lists is not the same", function))

}

func TestDeleteSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := adminClientMock{}

	function := "deleteSiteReplicationInfo()"
	ctx := context.Background()

	retValueMock := &madmin.ReplicateRemoveStatus{
		Status:    "success",
		ErrDetail: "",
	}

	expValueMock := &madmin.ReplicateRemoveStatus{
		Status:    "success",
		ErrDetail: "",
	}

	deleteSiteReplicationInfoMock = func(ctx context.Context, removeReq madmin.SRRemoveReq) (res *madmin.ReplicateRemoveStatus, err error) {
		return retValueMock, nil
	}

	remReq := madmin.SRRemoveReq{
		SiteNames: []string{
			"test1",
		},
		RemoveAll: false,
	}

	srInfo, err := adminClient.deleteSiteReplicationInfo(ctx, remReq)

	if err != nil {

	}

	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: length of lists is not the same", function))

}
