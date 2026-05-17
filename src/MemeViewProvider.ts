import * as vscode from 'vscode';

export class MemeViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'errorMemeView';

    private _view?: vscode.WebviewView;

    private isExecutionSuccess = false;

    constructor(
        private readonly _extensionUri: vscode.Uri
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView
    ) {

        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'media')
            ]
        };

        this.updateWebview();

        vscode.languages.onDidChangeDiagnostics(() => {
            this.updateWebview();
        });

        vscode.workspace.onDidChangeTextDocument(() => {

            if (this.isExecutionSuccess) {

                this.isExecutionSuccess = false;

                this.updateWebview();

            }

        });

        vscode.window.onDidStartTerminalShellExecution(() => {

            const totalErrors = this.getTotalErrors();

            if (totalErrors === 0) {

                this.isExecutionSuccess = true;

                this.updateWebview();

            }

        });

        vscode.window.onDidCloseTerminal(() => {

            const totalErrors = this.getTotalErrors();

            if (totalErrors === 0) {

                this.isExecutionSuccess = true;

                this.updateWebview();

            }

        });

    }

    private updateWebview() {

        if (!this._view) {
            return;
        }

        const totalErrors = this.getTotalErrors();

        let imageName = 'default.png';

        if (this.isExecutionSuccess) {

            imageName = 'samay-raina-dance.gif';

        }
        else if (totalErrors === 0) {

            imageName = 'default.png';

        }
        else if (totalErrors <= 10) {

            imageName = 'leonardo-meme.jpg';

        }
        else if (totalErrors <= 20) {

            imageName = 'ashneer-grover-meme.jpg';

        }
        else if (totalErrors <= 30) {

            imageName = 'gangs-of-wasseypur-meme.jpg';

        }
        else if (totalErrors <= 40) {

            imageName = 'laughing.gif';

        }
        else if (totalErrors <= 50) {

            imageName = 'jal-lijiye.jpg';

        }
        else if (totalErrors <= 60) {

            imageName = 'head-slap.gif';

        }
        else if (totalErrors <= 70) {

            imageName = 'alakh-pandey-meme.jpg';

        }
        else if (totalErrors <= 80) {

            imageName = 'speed.gif';

        }
        else if (totalErrors <= 90) {

            imageName = 'looking-at-sky.gif';

        }
        else if (totalErrors <= 100) {

            imageName = 'computer-break.gif';

        }
        else if (totalErrors <= 110) {

            imageName = 'homelander.gif';

        }
        else if (totalErrors <= 120) {

            imageName = 'ryan-thinking.gif';

        }
        else {

            imageName = 'absolute-cinema.jpg';

        }

        const imageUri = this._view.webview.asWebviewUri(
            vscode.Uri.joinPath(
                this._extensionUri,
                'media',
                imageName
            )
        );

        this._view.webview.html = this.getHtml(
            imageUri,
            totalErrors
        );
    }

    private getTotalErrors(): number {

        const diagnostics = vscode.languages.getDiagnostics();

        let totalErrors = 0;

        diagnostics.forEach(([_, diagnosticArray]) => {

            diagnosticArray.forEach((diag) => {

                if (diag.severity === vscode.DiagnosticSeverity.Error) {

                    totalErrors++;

                }

            });

        });

        return totalErrors;
    }

    private getHtml(
        imageUri: vscode.Uri,
        totalErrors: number
    ): string {

        const errorColor =
            totalErrors === 0 ? 'white' : '#ff4d4d';

        return `
    <!DOCTYPE html>
    <html lang="en">

    <head>

        <style>

            body {
                padding: 20px;
                text-align: center;
                background: #1e1e1e;
                color: white;
                font-family: sans-serif;
            }

            h1 {
                font-size: 28px;
                margin-bottom: 20px;
                color: ${errorColor};
            }

            img {
                width: 100%;
                max-width: 320px;
            }

        </style>

    </head>

    <body>

        <h1>Total Errors: ${totalErrors}</h1>

        <img src="${imageUri}" />

    </body>

    </html>
    `;
    }
}