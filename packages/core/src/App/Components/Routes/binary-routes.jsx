import React from 'react';
import { Switch, Prompt, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { observer, useStore } from '@deriv/stores';
import { moduleLoader, routes } from '@deriv/shared';

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

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ 'Modules/Page404'));

const BinaryRoutes = observer(props => {
    const { client, ui, gtm } = useStore();
    const { has_wallet } = client;
    const { promptFn, prompt_when } = ui;
    const { pushDataLayer } = gtm;
    const location = useLocation();
    React.useEffect(() => {
        pushDataLayer({ event: 'page_load' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // if (!client.loginid) return <div>LOADING</div>;

    return (
        <React.Suspense fallback={<Loading />}>
            <Prompt when={prompt_when} message={promptFn} />
            <Switch>
                {getRoutesConfig().map((route, idx) => {
                    return <RouteWithSubRoutes key={idx} {...route} {...props} />;
                })}
                <RouteWithSubRoutes
                    path={routes.traders_hub}
                    component={has_wallet ? Wallets : AppStore}
                    exact={!has_wallet}
                    passthrough={props.passthrough}
                    // getTitle={() => (is_logged_in || is_logging_in ? title_TH : title_TH_logged_out)}
                />
                {/* For default page route if page/path is not found, must be kept at the end of routes_config array */}
                <RouteWithSubRoutes component={Page404} />
            </Switch>
        </React.Suspense>
    );
});

export default BinaryRoutes;
