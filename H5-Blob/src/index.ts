import './btoa.ts';

class BinaryProcessing {

    createdXhr(url: string, config?: {}) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(this.http(xhr.response))
                }
            }
            xhr.responseType = 'blob';
            xhr.send();
        })
    }

    bufferToBase64(buffer:any){
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return `data:image/jpeg;base64,${window.btoa( binary)}`;
    }

    http(response: any) {
        const blob = new Blob([response])
        return this.readAsDataURL(blob);
    }

    readAsDataURL(blob:Blob){
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => {
                resolve(reader.result as string);
            }
        })
    }

    createObjectURL(blob:Blob){
        return URL.createObjectURL(blob)
    }

}

(async function () {
    let blobData = new BinaryProcessing();
    const url = await blobData.createdXhr('http://admin.luoyetree.top/static/js.png') as string;
    let img = document.createElement('img');
    img.src = url;
    document.body.appendChild(img);
})()

