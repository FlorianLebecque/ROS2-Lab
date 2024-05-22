
export const exportToJson = (layout: any, boxContent: any) => {
    const dataToExport = {
        layout: layout,
        boxContent: boxContent
    };
    const jsonString = JSON.stringify(dataToExport, null, 2); // Beautify the JSON output
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "layout_data.json"; // Name the download file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const handleFileUpload = (event: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (event === null || event.target === null) {
            reject(new Error("No file selected."));
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e: any) => {
            try {
                const parsedJson = JSON.parse(e.target.result);
                resolve(parsedJson);
            } catch (err) {
                console.error("Error parsing JSON:", err);
                reject(err);
            }
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};