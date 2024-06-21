import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { t } from 'i18next';
import { saveImage } from "@/lib/api"


const useSaveChanges = (file: File, renders: HTMLImageElement[] = []) => {
    const [searchParams] = useSearchParams();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { toast } = useToast();

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
    }, [file, renders, searchParams, toast]);

    return { saveChanges, isSaving, isSaved };
};

export default useSaveChanges;
