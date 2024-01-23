import styles from '@design-system/modules/ImageCaption.module.scss';
import { useDarkmode } from '@utils/hooks/useDarkmode';
import classnames from 'classnames';
import type { ReactNode } from 'react';

interface Props {
    imageSrc: string;
    alt: string;
    centered?: boolean;
    constrained?: boolean;
    descriptionTop?: boolean;
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    /**
     * Enable styles for dark mode using CSS Filters
     *
     * Alternatively, add `-dark` suffixed image in `imagePath` to add
     * dark mode image manually
     */
    enableDarkModeFilter?: boolean;
    darkModeImage?: string;
    children: ReactNode;
}

/**
 * This can be used to show an image in a box, along with text if provided,
 * and provides various options for configuring the appearance.
 */
export const ImageCaption = ({
    imageSrc,
    alt,
    centered,
    children,
    constrained,
    descriptionTop,
    width,
    height,
    maxWidth,
    minWidth,
    enableDarkModeFilter = false,
    darkModeImage,
}: Props) => {
    const [darkMode] = useDarkmode();
    const src = darkMode ? darkModeImage : imageSrc;

    const style: any = {};
    if (width !== undefined) {
        style.width = width;
    }
    if (minWidth !== undefined) {
        style.minWidth = minWidth;
    }
    if (maxWidth !== undefined) {
        style.maxWidth = maxWidth;
    }
    if (height !== undefined) {
        style.height = height;
    }

    const description = children && (
        <div
            className={classnames(styles.body, {
                [styles.top]: descriptionTop,
            })}
        >
            <div className={styles.bodyText}>{children}</div>
        </div>
    );

    return (
        <div
            className={classnames(styles.imageCaption, {
                [styles.centered]: centered,
                [styles.constrained]: constrained,
                [styles.darkmodeFilter]: enableDarkModeFilter,
            })}
            style={style}
        >
            {descriptionTop && description}
            <img src={src} className={styles.image} alt={alt} />
            {!descriptionTop && description}
        </div>
    );
};
