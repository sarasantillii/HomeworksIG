// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite(bgImg, fgImg, fgOpac, fgPos)
{
    //estraggo i valori RGBA dei pixel delle due immagini
    let bgData = bgImg.data;
    let fgData = fgImg.data;

    //salvo le dimensioni delle immagini
    let bgWidth = bgImg.width;
    let bgHeight = bgImg.height;
    let fgWidth = fgImg.width;
    let fgHeight = fgImg.height;

    //scorro i pixel dell'immagine foregroung
    for (let fy = 0; fy < fgHeight; fy++) {
        for (let fx = 0; fx < fgWidth; fx++) {

            //calcolo la posizione del pixel del foreground rispetto al background
            let bx = fx + fgPos.x;
            let by = fy + fgPos.y;

            // Ignora i pixel fuori dall'area del background
            if (bx < 0 || by < 0 || bx >= bgWidth || by >= bgHeight) {
                continue; 
            }

            //leggo indici dei pixel nelle posizioni (fx,fy) e (bx,by)
            let fgIndex = (fy * fgWidth + fx) * 4;
            let bgIndex = (by * bgWidth + bx) * 4;

            let fgAlpha = (fgData[fgIndex + 3] / 255) * fgOpac;

            //bgAlpha ci dice quanto del background resta visibile 
            let bgAlpha = 1 - fgAlpha;

            // Alpha Blending: c = fgData * fgAlpha + bgData * bgAlpha
            bgData[bgIndex]     = fgData[fgIndex] * fgAlpha + bgData[bgIndex] * bgAlpha;          // Red
            bgData[bgIndex + 1] = fgData[fgIndex + 1] * fgAlpha + bgData[bgIndex + 1] * bgAlpha;  // Green
            bgData[bgIndex + 2] = fgData[fgIndex + 2] * fgAlpha + bgData[bgIndex + 2] * bgAlpha;  // Blue
            bgData[bgIndex + 3] = (fgAlpha + bgData[bgIndex + 3] / 255 * bgAlpha) * 255; // Alpha
        }
    }
}

