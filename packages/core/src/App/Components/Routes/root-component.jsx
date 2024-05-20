import React from 'react';
import { moduleLoader, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import RouteWithSubRoutes from './route-with-sub-routes';

const AppStore = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "appstore" */ '@deriv/appstore');
    })
);

const Wallets = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "wallets" */ '@deriv/wallets');
    })
);

const RootComponent = observer(props => {
    const { client } = useStore();
    const { has_wallet, is_logged_in, is_logging_in } = client;

    const title_TH = localize("Trader's Hub");
    const title_TH_logged_out = localize('Deriv App');

    return (
        <RouteWithSubRoutes
            {...props}
            path={routes.traders_hub}
            component={has_wallet ? Wallets : AppStore}
            exact={!has_wallet}
            getTitle={() => (is_logged_in || is_logging_in ? title_TH : title_TH_logged_out)}
        />
    );
});

export default RootComponent;
