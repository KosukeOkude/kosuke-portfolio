import type { ReactNode } from "react";


export type DetailSubImage = {
    src: string;
    alt?: string;
}

export type DetailImageSource = {
    mainImageUrl: string;
    mainImageAlt?: string;
    subImages?: DetailSubImage[];
};

export type DetailImageGalleryWithLightboxProps = DetailImageSource & {
    children?: ReactNode;
}