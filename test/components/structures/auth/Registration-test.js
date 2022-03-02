/*
Copyright 2019 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { createClient } from 'matrix-js-sdk/src/matrix';

import SdkConfig, { DEFAULTS } from '../../../../src/SdkConfig';
import { createTestClient, mkServerConfig } from "../../../test-utils";
import Registration from "../../../../src/components/structures/auth/Registration";
import RegistrationForm from "../../../../src/components/views/auth/RegistrationForm";

jest.mock('matrix-js-sdk/src/matrix');
jest.useFakeTimers();

describe('Registration', function() {
    let parentDiv;

    beforeEach(function() {
        jest.spyOn(SdkConfig, "get").mockReturnValue({
            ...DEFAULTS,
            disable_custom_urls: true,
        });
        parentDiv = document.createElement('div');
        document.body.appendChild(parentDiv);
        createClient.mockImplementation(() => createTestClient());
    });

    afterEach(function() {
        ReactDOM.unmountComponentAtNode(parentDiv);
        parentDiv.remove();
    });

    function render() {
        return ReactDOM.render(<Registration
            serverConfig={mkServerConfig("https://matrix.org", "https://vector.im")}
            makeRegistrationUrl={() => {}}
            onLoggedIn={() => {}}
            onLoginClick={() => {}}
            onServerConfigChange={() => {}}
        />, parentDiv);
    }

    it('should show server picker', async function() {
        const root = render();
        const selector = ReactTestUtils.findRenderedDOMComponentWithClass(root, "mx_ServerPicker");
        expect(selector).toBeTruthy();
    });

    it('should show form when custom URLs disabled', async function() {
        const root = render();

        // Set non-empty flows & matrixClient to get past the loading spinner
        root.setState({
            flows: [{
                stages: [],
            }],
            matrixClient: {},
            busy: false,
        });

        const form = ReactTestUtils.findRenderedComponentWithType(
            root,
            RegistrationForm,
        );
        expect(form).toBeTruthy();
    });

    it("should show SSO options if those are available", async () => {
        const root = render();

        // Set non-empty flows & matrixClient to get past the loading spinner
        root.setState({
            flows: [{
                stages: [],
            }],
            ssoFlow: {
                type: "m.login.sso",
            },
            matrixClient: {},
            busy: false,
        });

        const ssoButton = ReactTestUtils.findRenderedDOMComponentWithClass(root, "mx_SSOButton");
        expect(ssoButton).toBeTruthy();
    });
});
