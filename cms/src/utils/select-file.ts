import { saveRessource } from "../services/ressources";

export function onInputFileChange(event: Event): Promise<string> {
    return new Promise((resolve, reject) => {
        const target = (event.target as HTMLInputElement)
        const files = target.files;
        if(!files) return '';
        const file = files[0]
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string)
        };
        reader.onerror = () => {
            reject(new Error('Unable to read local file'))
        }
        reader.readAsDataURL(file)
    })
}


export function selectFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = "file"
        input.onchange = async (e: Event) => {
            try {
                const dataUrl = await onInputFileChange(e)
                const url = await saveRessource(dataUrl)
                resolve(url)
            } catch (e) {
                console.error(e)
                reject(e)
            }
        }
        document.body.appendChild(input)
        input.click();
    })
}