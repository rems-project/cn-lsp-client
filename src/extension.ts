/****************************************************************************/
/*  BSD 2-Clause License                                                    */
/*                                                                          */
/*  Copyright (c) 2021 Dhruv Makwana                                        */
/*  All rights reserved.                                                    */
/*                                                                          */
/*  This software was developed by the University of Cambridge Computer     */
/*  Laboratory as part of the Rigorous Engineering of Mainstream Systems    */
/*  (REMS) project.                                                         */
/*                                                                          */
/*  This project has been partly funded by an EPSRC Doctoral Training       */
/*  studentship. This project has been partly funded by Google. This        */
/*  project has received funding from the European Research Council (ERC)   */
/*  under the European Union's Horizon 2020 research and innovation         */
/*  programme (grant agreement No 789108, ELVER).                           */
/*                                                                          */
/*  Redistribution and use in source and binary forms, with or without      */
/*  modification, are permitted provided that the following conditions      */
/*  are met:                                                                */
/*  1. Redistributions of source code must retain the above copyright       */
/*     notice, this list of conditions and the following disclaimer.        */
/*  2. Redistributions in binary form must reproduce the above copyright    */
/*     notice, this list of conditions and the following disclaimer in      */
/*     the documentation and/or other materials provided with the           */
/*     distribution.                                                        */
/*                                                                          */
/*  THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND  */
/*  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE   */
/*  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR      */
/*  PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS   */
/*  BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR  */
/*  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF    */
/*  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR         */
/*  BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,   */
/*  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE    */
/*  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN  */
/*  IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.                           */
/****************************************************************************/

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
