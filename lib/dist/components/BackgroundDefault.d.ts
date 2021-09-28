import type { IComponentDefinition } from "../states/visualComponentState";
import type { IBackgroundComponentProps } from "../states/diagramSettings";
export declare const createGridImageGenerator: (sizeMultiplicator: number, linesColor: string, linesOpacity: number) => BackgroundImageGenerator;
export declare const createDotsImageGenerator: (sizeMultiplicator: number, dotsColor: string, dotsOpacity: number, dotsRadius: number) => BackgroundImageGenerator;
export declare const createCrossesImageGenerator: (sizeMultiplicator: number, color: string, opacity: number) => BackgroundImageGenerator;
export declare const createDefaultBackground: (settings?: Partial<IBackgroundDefaultSettings> | undefined) => IComponentDefinition<IBackgroundComponentProps, IBackgroundDefaultSettings>;
export declare type BackgroundImageGenerator = (width: number, height: number) => string;
/**
 * @property {function}  imageGenerator - Function to create string for css's backgroundUrl property.
 * You can use for example services like listed in this article https://css-tricks.com/websites-generate-svg-patterns/
 * to generate this string.
 */
export interface IBackgroundDefaultSettings {
    imageGenerator?: BackgroundImageGenerator;
    color: string;
}
//# sourceMappingURL=BackgroundDefault.d.ts.map