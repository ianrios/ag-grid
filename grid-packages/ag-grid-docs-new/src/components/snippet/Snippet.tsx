import type { Framework } from '@ag-grid-types';

import Code, { type Language } from '../Code';
import * as snippetTransformer from './snippetTransformer';

const languages = {
    react: 'jsx',
    javascript: 'js',
    angular: 'ts',
    vue: 'ts',
};

interface Props {
    framework: Framework;
    content: string;
    transform?: boolean;
    language?: Language;
    lineNumbers?: boolean;
    suppressFrameworkContext?: boolean;
    spaceBetweenProperties?: boolean;
    inlineReactProperties?: boolean;
    children?: any;
}

/**
 * This takes a code snippet written in JavaScript and transforms it into an idiomatic code snippet for the selected
 * framework.
 */
export const Snippet = (props: Props) => {
    const {
        framework,
        content,
        transform = true,
        language,
        lineNumbers,
        suppressFrameworkContext,
        spaceBetweenProperties,
        inlineReactProperties,
    } = props;

    // create FW specific snippet
    const snippet = transform
        ? snippetTransformer.transform(content, framework, {
              suppressFrameworkContext,
              spaceBetweenProperties,
              inlineReactProperties,
          })
        : content;

    return (
        <Code
            code={snippet}
            language={language ? language : (languages[framework] as Language)}
            lineNumbers={lineNumbers}
        />
    );
};
