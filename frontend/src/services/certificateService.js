import API from "../api/axios";

export const downloadCertificate = async (assessmentId) => {

    const response = await API.get(
        `/certificate/${assessmentId}`,
        {
            responseType: "blob"
        }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
    );

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
        "download",
        `certificate_${assessmentId}.pdf`
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

};
