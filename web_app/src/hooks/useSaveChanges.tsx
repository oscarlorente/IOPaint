import { useCallback } from 'react';
import { useStore } from "@/lib/states"
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { t } from 'i18next';
import { saveImage } from "@/lib/api"


const useSaveChanges = (file: File, renders: HTMLImageElement[] = []) => {
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const setIsSaved = useStore((state) => state.setIsSaved);
    const setIsSaving = useStore((state) => state.setIsSaving);

    const saveChanges = useCallback(async () => {
        setIsSaving(true);
        setIsSaved(false);

        const imageId = searchParams.get("imageId")!;
        const userToken = searchParams.get("userToken")!;

        toast({
            title: t('editor.savingImageToastTitle'),
            description: t('editor.savingImageToastDescription'),
        });

        try {
            const lastRender = renders[renders.length - 1];
            if (!lastRender) {
                throw new Error("No renders available to save.");
            }

            await saveImage(
                lastRender,
                file.name,
                file.type,
                imageId,
                userToken
            );
            setIsSaved(true);
            window.parent.postMessage({ type: 'image_saved', isImageSaved: true }, '*');
            toast({
                variant: "success",
                title: t('editor.saveImageSuccessToastTitle'),
                description: t('editor.saveImageSuccessToastDescription'),
            });
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: t('editor.saveImageErrorToastTitle'),
                description: t('editor.saveImageErrorToastDescription'),
                showClose: true,
            });
            console.error(e.message ? e.message : e.toString());
        } finally {
            setIsSaving(false);
        }
     }, [file, renders, searchParams, toast, setIsSaved, setIsSaving]);

    const isSaved = useStore(state => state.isSaved);
    const isSaving = useStore(state => state.isSaving);

    return { saveChanges, isSaving, isSaved };
};

export default useSaveChanges;
