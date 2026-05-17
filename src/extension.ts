import * as vscode from 'vscode';
import { MemeViewProvider } from './MemeViewProvider';

export function activate(context: vscode.ExtensionContext) {

    const provider = new MemeViewProvider(context.extensionUri);

    context.subscriptions.push(

        vscode.window.registerWebviewViewProvider(
            MemeViewProvider.viewType,
            provider
        )

    );
}

export function deactivate() {}