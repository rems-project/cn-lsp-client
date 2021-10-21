/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as os from 'os';
import { HtmlPreviewEditorProvider } from './htmlPreviewEditor';
import { ExtensionContext } from 'vscode';
import { CloseAction, ErrorAction } from 'vscode-languageclient';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

const serverCmd = os.platform() === "win32" ? "cnlsp.exe" : "cnlsp";

export function activate(context: ExtensionContext) {
	
    context.subscriptions.push(HtmlPreviewEditorProvider.register(context));

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		debug: {
			transport: TransportKind.stdio,
			command: serverCmd
		},
		run: {
			transport: TransportKind.stdio,
			command: serverCmd
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'c' }],
		errorHandler : {
			error: (error, message, count) => {
				return ErrorAction.Continue;
			},
			closed : () => {
				return CloseAction.Restart;
			}
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'cn-languageserver',
		'CN Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
