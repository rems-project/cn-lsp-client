import * as vscode from 'vscode';

export class HtmlPreviewEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new HtmlPreviewEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(HtmlPreviewEditorProvider.viewType, provider,
			{ webviewOptions : { } } );
		return providerRegistration;
	}

	private static readonly viewType = 'htmlpreview.editor';

	constructor(
		private readonly context: vscode.ExtensionContext
	) {
	}

	/**
	 * Called when the custom editor is opened.
	 * 
	 * 
	 */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		panel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {

        // FIXME - reopening the same file doesn't work

		const html = css + document.getText();
        panel.webview.html = html;
        // Work-around for this issue: https://github.com/Microsoft/vscode/issues/71608
        // Awaiting this PR to be merged: https://github.com/microsoft/vscode/pull/87832
        vscode.commands.executeCommand('workbench.action.focusSecondEditorGroup');
        setTimeout(() => { panel.reveal(vscode.ViewColumn.Two); }, 50);
	}
}

const css =`
<style type="text/css" media="screen">
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');
 * {
     font-size: 10.5pt 
}
 html {
     font-family: 'Source Code Pro', monospace;
    ;
     padding: 0;
     margin: 0;
    /* font-size: 8pt;
     */
}
 body {
     padding: 0;
     margin: 0;
}
 table {
     border: 1px solid;
     border-collapse: collapse;
    /* max-width: 1400px;
     */
    /* table-layout: fixed;
     */
}
 tr {
     padding : 0;
     margin : 0;
}
 th, td {
     text-align: left;
     vertical-align: top;
     border-left: 1px solid;
     border-right: 1px solid;
     padding-left: 5px;
     padding-right: 5px;
     padding-right: 5px;
     padding-top: 3px;
     padding-bottom: 3px;
}
 th {
     padding-top: 5px;
     padding-bottom: 5px;
}
 .loc_v {
     text-align: right;
}
 @media (prefers-color-scheme: dark) {
     html {
         background-color: black;
         color: lightgray;
    }
     table, th, td {
         border-color: #202020;
    }
     th {
         color: white;
         background-color: #202020;
    }
     tr:hover {
         background-color: #101010;
         color: cyan;
    }
}
 @media (prefers-color-scheme: light) {
     html {
         background-color: white;
         color: black;
    }
     table, th, td {
         border-color: #DFDFDF;
    }
     th {
         color: black;
         background-color: #DFDFDF;
    }
     tr:hover {
         background-color: #E2F0FF;
         color: black;
    }
}
</style>
`;
