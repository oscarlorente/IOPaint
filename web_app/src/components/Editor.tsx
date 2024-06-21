import { SyntheticEvent, useCallback, useEffect, useRef, useState } from "react"
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline"
import { useToast } from "@/components/ui/use-toast"
import {
  ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch"
import { runPlugin } from "@/lib/api"
import { Button, IconButton } from "@/components/ui/button"
import {
  cn,
  drawLines,
  isMidClick,
  isRightClick,
  mouseXY,
  srcToFile,
} from "@/lib/utils"
import { Eraser, Eye, Redo, Undo } from "lucide-react"
import { useImage } from "@/hooks/useImage"
import { Slider } from "./ui/slider"
import { PluginName } from "@/lib/types"
import { useStore } from "@/lib/states"
import Cropper from "./Cropper"
import { InteractiveSegPoints } from "./InteractiveSeg"
import Extender from "./Extender"
import { MAX_BRUSH_SIZE, MIN_BRUSH_SIZE } from "@/lib/const"
import { useTranslation } from 'react-i18next';

const TOOLBAR_HEIGHT = 200

interface EditorProps {
  file: File
}

export default function Editor(props: EditorProps) {
  const { file } = props
  const { toast } = useToast()
  const { t } = useTranslation()
  
  const [
    windowSize,
    isInpainting,
    imageWidth,
    imageHeight,
    settings,
    setImageSize,
    setBaseBrushSize,
    interactiveSegState,
    updateInteractiveSegState,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    undo,
    redo,
    undoDisabled,
    redoDisabled,
    isProcessing,
    updateAppState,
    runInpainting,
    isCropperExtenderResizing
  ] = useStore((state) => [
    state.windowSize,
    state.isInpainting,
    state.imageWidth,
    state.imageHeight,
    state.settings,
    state.setImageSize,
    state.setBaseBrushSize,
    state.interactiveSegState,
    state.updateInteractiveSegState,
    state.handleCanvasMouseDown,
    state.handleCanvasMouseMove,
    state.undo,
    state.redo,
    state.undoDisabled(),
    state.redoDisabled(),
    state.getIsProcessing(),
    state.updateAppState,
    state.runInpainting,
    state.isCropperExtenderResizing
  ])
  const baseBrushSize = useStore((state) => state.editorState.baseBrushSize)
  const brushSize = useStore((state) => state.getBrushSize())
  const renders = useStore((state) => state.editorState.renders)
  const extraMasks = useStore((state) => state.editorState.extraMasks)
  const temporaryMasks = useStore((state) => state.editorState.temporaryMasks)
  const curLineGroup = useStore((state) => state.editorState.curLineGroup)

  // Local State
  const [showOriginal, setShowOriginal] = useState(false)
  const [original, isOriginalLoaded] = useImage(file)
  const [context, setContext] = useState<CanvasRenderingContext2D>()
  const [imageContext, setImageContext] = useState<CanvasRenderingContext2D>()
  const [{ x, y }, setCoords] = useState({ x: -1, y: -1 })
  const [showBrush, setShowBrush] = useState(false)
  const [showRefBrush, setShowRefBrush] = useState(false)
  const [isPanning, setIsPanning] = useState<boolean>(false)
  const [isSaving] = useState<boolean>(false)
  const [scale, setScale] = useState<number>(1)
  const [minScale, setMinScale] = useState<number>(1.0)
  // const [prevScale, setPrevScale] = useState<number>(1.0)
  const [panned, setPanned] = useState<boolean>(false)
  const windowCenterX = windowSize.width / 2
  const windowCenterY = windowSize.height / 2
  const viewportRef = useRef<ReactZoomPanPinchContentRef | null>(null)
  // Indicates that the image has been loaded and is centered on first load
  const [initialCentered, setInitialCentered] = useState(false)

  const [isDraging, setIsDraging] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false);
  const hadDrawSomething = useCallback(() => {
    return curLineGroup.length !== 0
  }, [curLineGroup])

  useEffect(() => {
    if (
      !imageContext ||
      !isOriginalLoaded ||
      imageWidth === 0 ||
      imageHeight === 0
    ) {
      return
    }
    const render = renders.length === 0 ? original : renders[renders.length - 1]
    imageContext.canvas.width = imageWidth
    imageContext.canvas.height = imageHeight

    imageContext.clearRect(
      0,
      0,
      imageContext.canvas.width,
      imageContext.canvas.height
    )
    imageContext.drawImage(render, 0, 0, imageWidth, imageHeight)
  }, [
    renders,
    original,
    isOriginalLoaded,
    imageContext,
    imageHeight,
    imageWidth,
  ])

  useEffect(() => {
    if (
      !context ||
      !isOriginalLoaded ||
      imageWidth === 0 ||
      imageHeight === 0
    ) {
      return
    }
    context.canvas.width = imageWidth
    context.canvas.height = imageHeight
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    temporaryMasks.forEach((maskImage) => {
      context.drawImage(maskImage, 0, 0, imageWidth, imageHeight)
    })
    extraMasks.forEach((maskImage) => {
      context.drawImage(maskImage, 0, 0, imageWidth, imageHeight)
    })

    if (
      interactiveSegState.isInteractiveSeg &&
      interactiveSegState.tmpInteractiveSegMask
    ) {
      context.drawImage(
        interactiveSegState.tmpInteractiveSegMask,
        0,
        0,
        imageWidth,
        imageHeight
      )
    }
    drawLines(context, curLineGroup)
  }, [
    temporaryMasks,
    extraMasks,
    isOriginalLoaded,
    interactiveSegState,
    context,
    curLineGroup,
    imageHeight,
    imageWidth,
  ])

  const getCurrentRender = useCallback(async () => {
    let targetFile = file
    if (renders.length > 0) {
      const lastRender = renders[renders.length - 1]
      targetFile = await srcToFile(lastRender.currentSrc, file.name, file.type)
    }
    return targetFile
  }, [file, renders])

  const getCurrentWidthHeight = useCallback(() => {
    let width = 512
    let height = 512
    if (!isOriginalLoaded) {
      return [width, height]
    }
    if (renders.length === 0) {
      width = original.naturalWidth
      height = original.naturalHeight
    } else if (renders.length !== 0) {
      width = renders[renders.length - 1].width
      height = renders[renders.length - 1].height
    }

    return [width, height]
  }, [original, isOriginalLoaded, renders])

  // Draw once the original image is loaded
  useEffect(() => {
    if (!isOriginalLoaded) {
      return
    }

    const [width, height] = getCurrentWidthHeight()
    if (width !== imageWidth || height !== imageHeight) {
      setImageSize(width, height)
    }

    const rW = windowSize.width / width
    // const rH = windowSize.height / height
    const rH = (windowSize.height - TOOLBAR_HEIGHT) / height

    let s = 1.0
    if (rW < 1 || rH < 1) {
      s = Math.min(rW, rH)
    }
    setMinScale(s)
    // setScale(s)
    // setPrevScale(s)

    console.log(
      `[on file load] image size: ${width}x${height}, scale: ${s}, minScale: ${minScale}, initialCentered: ${initialCentered}`
    )

    window.parent.postMessage({ type: 'image_loaded', isImageLoaded: true }, '*')

    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    if (context?.canvas) {
      console.log("[on file load] set canvas size")
      if (width != context.canvas.width) {
        context.canvas.width = width
      }
      if (height != context.canvas.height) {
        context.canvas.height = height
      }
    }

    if (!initialCentered) {
      // 防止每次擦除以后图片 zoom 还原
      viewportRef.current?.centerView(s, 1)
      console.log("[on file load] centerView")
      setInitialCentered(true)
    }
  }, [
    viewportRef,
    imageHeight,
    imageWidth,
    original,
    isOriginalLoaded,
    windowSize,
    initialCentered,
    getCurrentWidthHeight,
  ])

  useEffect(() => {
    console.log("[useEffect] centerView")
    // render 改变尺寸以后，undo/redo 重新 center
    viewportRef?.current?.centerView(minScale, 1)
  }, [imageHeight, imageWidth, viewportRef, minScale])

  // Zoom reset
  const resetZoom = useCallback(() => {
    if (!minScale || !windowSize) {
      return
    }
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }
    const offsetX = (windowSize.width - imageWidth * minScale) / 2
    const offsetY = (windowSize.height - imageHeight * minScale) / 2
    viewport.setTransform(offsetX, offsetY, minScale, 200, "easeOutQuad")
    if (viewport.instance.transformState.scale) {
      viewport.instance.transformState.scale = minScale
    }

    // setPrevScale(scale)
    // setScale(minScale)
    setPanned(false)
  }, [
    viewportRef,
    windowSize,
    imageHeight,
    imageWidth,
    windowSize.height,
    minScale,
  ])

  // Zoom reset
  useEffect(() => {
    if (!minScale || !windowSize) {
      return
    }
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }
    // console.log(`prevScale: ${prevScale}, scale: ${scale}, minScale: ${minScale}`)
    console.log(`scale: ${scale}, minScale: ${minScale}`)
    // if (prevScale > scale && scale*0.75 <= minScale) {
    if (scale*0.95 <= minScale) {
      viewportRef.current?.centerView(scale, 1)
    }
    // setPrevScale(scale)
  }, [
    scale,
  ])


  useEffect(() => {
    window.addEventListener("resize", () => {
      resetZoom()
    })
    return () => {
      window.removeEventListener("resize", () => {
        resetZoom()
      })
    }
  }, [windowSize, resetZoom])

  const onMouseMove = (ev: SyntheticEvent) => {
    const mouseEvent = ev.nativeEvent as MouseEvent
    setCoords({ x: mouseEvent.pageX, y: mouseEvent.pageY })
  }

  const onMouseDrag = (ev: SyntheticEvent) => {
    if (isProcessing) {
      return
    }

    if (interactiveSegState.isInteractiveSeg) {
      return
    }
    if (isPanning) {
      return
    }
    if (!isDraging) {
      return
    }
    if (curLineGroup.length === 0) {
      return
    }

    handleCanvasMouseMove(mouseXY(ev))
  }

  const runInteractiveSeg = async (newClicks: number[][]) => {
    updateAppState({ isPluginRunning: true })
    const targetFile = await getCurrentRender()
    try {
      const res = await runPlugin(
        true,
        PluginName.InteractiveSeg,
        targetFile,
        undefined,
        newClicks
      )
      const { blob } = res
      const img = new Image()
      img.onload = () => {
        updateInteractiveSegState({ tmpInteractiveSegMask: img })
      }
      img.src = blob
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.message ? e.message : e.toString(),
      })
    }
    updateAppState({ isPluginRunning: false })
  }

  const onPointerUp = (ev: SyntheticEvent) => {
    if (isMidClick(ev)) {
      setIsPanning(false)
      return
    }
    if (!hadDrawSomething()) {
      return
    }
    if (interactiveSegState.isInteractiveSeg) {
      return
    }
    if (isPanning) {
      return
    }
    if (!original.src) {
      return
    }
    const canvas = context?.canvas
    if (!canvas) {
      return
    }
    if (isInpainting) {
      return
    }
    if (!isDraging) {
      return
    }

    setIsDraging(false)
  }

  const onCanvasMouseUp = (ev: SyntheticEvent) => {
    if (interactiveSegState.isInteractiveSeg) {
      const xy = mouseXY(ev)
      const newClicks: number[][] = [...interactiveSegState.clicks]
      if (isRightClick(ev)) {
        newClicks.push([xy.x, xy.y, 0, newClicks.length])
      } else {
        newClicks.push([xy.x, xy.y, 1, newClicks.length])
      }
      runInteractiveSeg(newClicks)
      updateInteractiveSegState({ clicks: newClicks })
    }
  }

  const onMouseDown = (ev: SyntheticEvent) => {
    if (isProcessing) {
      return
    }
    if (interactiveSegState.isInteractiveSeg) {
      return
    }
    if (isPanning) {
      return
    }
    if (!isOriginalLoaded) {
      return
    }
    const canvas = context?.canvas
    if (!canvas) {
      return
    }

    if (isRightClick(ev)) {
      return
    }

    if (isMidClick(ev)) {
      setIsPanning(true)
      return
    }

    setIsDraging(true)
    handleCanvasMouseDown(mouseXY(ev))
  }

  const handleUndo = (keyboardEvent: KeyboardEvent | SyntheticEvent) => {
    keyboardEvent.preventDefault()
    undo()
  }

  const handleRedo = (keyboardEvent: KeyboardEvent | SyntheticEvent) => {
    keyboardEvent.preventDefault()
    redo()
  }

  const toggleShowBrush = (newState: boolean) => {
    if (newState !== showBrush && !isPanning && !isCropperExtenderResizing) {
      setShowBrush(newState)
    }
  }

  const getCursor = useCallback(() => {
    if (isProcessing) {
      return "default"
    }
    if (isPanning) {
      return "grab"
    }
    if (showBrush) {
      return "none"
    }
    return undefined
  }, [showBrush, isPanning, isProcessing])

  const getCurScale = (): number => {
    let s = minScale
    if (viewportRef.current?.instance?.transformState.scale !== undefined) {
      s = viewportRef.current?.instance?.transformState.scale
    }
    return s!
  }

  const getBrushStyle = (_x: number, _y: number) => {
    const curScale = getCurScale()
    console.log(`brush size: ${brushSize} - current scale: ${curScale}`)
    return {
      width: `${brushSize * curScale}px`,
      height: `${brushSize * curScale}px`,
      left: `${_x}px`,
      top: `${_y}px`,
      transform: "translate(-50%, -50%)",
    }
  }

  const renderBrush = (style: any) => {
    return (
      <div
        className="absolute rounded-[50%] border-[1px] border-[solid] border-[#3976F9] pointer-events-none bg-[#3976F9bb]"
        style={style}
      />
    )
  }

  const handleSliderChange = (value: number) => {
    setBaseBrushSize(value)

    if (!showRefBrush) {
      setShowRefBrush(true)
      window.setTimeout(() => {
        setShowRefBrush(false)
      }, 10000)
    }
  }

  const renderInteractiveSegCursor = () => {
    return (
      <div
        className="absolute h-[20px] w-[20px] pointer-events-none rounded-[50%] bg-[rgba(21,_215,_121,_0.936)] [box-shadow:0_0_0_0_rgba(21,_215,_121,_0.936)] animate-pulse"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <CursorArrowRaysIcon />
      </div>
    )
  }

  const renderCanvas = () => {
    return (
      <TransformWrapper
        ref={(r) => {
          if (r) {
            viewportRef.current = r
          }
        }}
        panning={{ disabled: !isPanning, velocityDisabled: true }}
        wheel={{ step: 0.05, wheelDisabled: false }}
        centerZoomedOut
        alignmentAnimation={{ disabled: true }}
        centerOnInit
        limitToBounds={true}
        doubleClick={{ disabled: true }}
        initialScale={minScale}
        minScale={minScale}
        onPanning={() => {
          if (!panned) {
            setPanned(true)
          }
        }}
        onZoom={(ref) => {
          setScale(ref.state.scale)
        }}
      >
        <TransformComponent
          contentStyle={{
            visibility: initialCentered ? "visible" : "hidden",
            opacity: initialCentered ? "1" : "0.5",
            transition: isLoaded ? "transform .2s ease-in" : "opacity .2s ease-in"
          }}
        >
          <div className="grid [grid-template-areas:'editor-content'] gap-y-4">
            <canvas
              className="[grid-area:editor-content]"
              style={{
              }}
              ref={(r) => {
                if (r && !imageContext) {
                  const ctx = r.getContext("2d")
                  if (ctx) {
                    setImageContext(ctx)
                  }
                }
              }}
            />
            <canvas
              className={cn(
                "[grid-area:editor-content]",
                isProcessing
                  ? "pointer-events-none animate-pulse duration-600"
                  : ""
              )}
              style={{
                cursor: getCursor(),
              }}
              onContextMenu={(e) => {
                e.preventDefault()
              }}
              onMouseOver={() => {
                toggleShowBrush(true)
                setShowRefBrush(false)
              }}
              onFocus={() => toggleShowBrush(true)}
              onMouseLeave={() => toggleShowBrush(false)}
              onMouseDown={onMouseDown}
              onMouseUp={onCanvasMouseUp}
              onMouseMove={onMouseDrag}
              ref={(r) => {
                if (r && !context) {
                  const ctx = r.getContext("2d")
                  if (ctx) {
                    setContext(ctx)
                  }
                }
              }}
            />
            <div
              className="[grid-area:editor-content] pointer-events-none grid [grid-template-areas:'original-image-content']"
              style={{
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
              }}
            >
              {showOriginal && (
                <>
                  <img
                    className="[grid-area:original-image-content]"
                    src={original.src}
                    alt="original"
                    style={{
                      width: `${imageWidth}px`,
                      height: `${imageHeight}px`,
                    }}
                  />
                </>
              )}
            </div>
          </div>

          <Cropper
            maxHeight={imageHeight}
            maxWidth={imageWidth}
            minHeight={Math.min(512, imageHeight)}
            minWidth={Math.min(512, imageWidth)}
            scale={getCurScale()}
            show={settings.showCropper}
          />

          <Extender
            minHeight={Math.min(512, imageHeight)}
            minWidth={Math.min(512, imageWidth)}
            scale={getCurScale()}
            show={settings.showExtender}
          />

          {interactiveSegState.isInteractiveSeg ? (
            <InteractiveSegPoints />
          ) : (
            <></>
          )}
        </TransformComponent>
      </TransformWrapper>
    )
  }

  return (
    <div
      className="flex items-center justify-center w-screen h-screen"
      aria-hidden="true"
      onMouseMove={onMouseMove}
      onMouseUp={onPointerUp}
    >
      {renderCanvas()}
      {showBrush &&
        !isInpainting &&
        !isPanning &&
        (interactiveSegState.isInteractiveSeg
          ? renderInteractiveSegCursor()
          : renderBrush(getBrushStyle(x, y)))}

      {showRefBrush && renderBrush(getBrushStyle(windowCenterX, windowCenterY))}

      <div className={`fixed flex bottom-5 border px-4 py-2 rounded-[3rem] gap-8 items-center justify-center backdrop-filter backdrop-blur-md bg-background/70 transition-opacity	${isDraging ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
        <Slider
          className="w-48"
          defaultValue={[50]}
          min={MIN_BRUSH_SIZE}
          max={MAX_BRUSH_SIZE}
          step={1}
          tabIndex={-1}
          value={[baseBrushSize]}
          onValueChange={(vals) => handleSliderChange(vals[0])}
          onClick={() => setShowRefBrush(false)}
          disabled={isProcessing || isSaving}
        />
        <div className="flex gap-2">
          <IconButton
            tooltip={t('editor.undo')}
            onClick={handleUndo}
            disabled={undoDisabled || isProcessing || isSaving}
          >
            <Undo />
          </IconButton>
          <IconButton
            tooltip={t('editor.redo')}
            onClick={handleRedo}
            disabled={redoDisabled}
          >
            <Redo />
          </IconButton>

          <IconButton
            tooltip={t('editor.showOriginalImage')}
            onPointerDown={(ev) => {
              if (!(renders.length === 0 || isProcessing || isSaving)) {
                ev.preventDefault()
                setShowOriginal(true)
              }
            }}
            onPointerUp={() => {
              setShowOriginal(false)
            }}
            disabled={renders.length === 0 || isProcessing || isSaving}
          >
            <Eye />
          </IconButton>

          <Button
            variant="outline"
            disabled={
              isProcessing || isSaving || (!hadDrawSomething() && extraMasks.length === 0)
            }
            onClick={() => {
              runInpainting()
            }}
          >
            <Eraser size="sm" />
            {t('editor.erase')}
          </Button>
        
      </div>
      </div>
    </div>
  )
}
