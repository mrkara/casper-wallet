import React, { useEffect, useState } from 'react';

import {
  HeaderSubmenuBarNavLink,
  HeaderViewInExplorer,
  PopupHeader,
  PopupLayout
} from '@libs/layout';
import { HomePageTabsId } from '@libs/ui';
import { RouterPath, useTypedLocation, useTypedNavigate } from '@popup/router';
import {
  dispatchFetchExtendedDeploysInfo,
  ExtendedDeploy
} from '@libs/services/account-activity-service';

import { ActivityDetailsPageContent } from './content';

export const ActivityDetailsPage = () => {
  const [deployInfo, setDeployInfo] = useState<ExtendedDeploy | null>(null);

  const location = useTypedLocation();
  const navigate = useTypedNavigate();

  const { activityDetailsData } = location.state;

  useEffect(() => {
    if (!activityDetailsData) {
      navigate(RouterPath.Home);
    }
  }, [activityDetailsData, navigate]);

  useEffect(() => {
    if (activityDetailsData?.deployHash) {
      dispatchFetchExtendedDeploysInfo(activityDetailsData?.deployHash).then(
        ({ payload: deployInfoResponse }) => {
          setDeployInfo(deployInfoResponse);
        }
      );
    }
  }, [activityDetailsData?.deployHash]);

  return (
    <PopupLayout
      renderHeader={() => (
        <PopupHeader
          withNetworkSwitcher
          withMenu
          withConnectionStatus
          renderSubmenuBarItems={() => (
            <>
              <HeaderSubmenuBarNavLink
                linkType="back"
                onClick={
                  activityDetailsData?.isDeploysList
                    ? () => {
                        if (activityDetailsData?.isDeploysList) {
                          navigate(RouterPath.Home, {
                            state: {
                              // set the active tab to deploys
                              activeTabId: HomePageTabsId.Deploys
                            }
                          });
                        }
                      }
                    : undefined
                }
              />
              <HeaderViewInExplorer deployHash={deployInfo?.deployHash} />
            </>
          )}
        />
      )}
      renderContent={() => (
        <ActivityDetailsPageContent
          fromAccount={activityDetailsData?.fromAccount}
          toAccount={activityDetailsData?.toAccount}
          type={activityDetailsData?.type}
          amount={activityDetailsData?.amount}
          symbol={activityDetailsData?.symbol}
          deployInfo={deployInfo}
        />
      )}
    />
  );
};
