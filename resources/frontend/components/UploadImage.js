import React, { useEffect, useState } from "react";
import styles from "./UploadImage.module";
import Icon from "./Icon";

export default function UploadImage({ onFileChange, error, uploadedImage }) {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        if (uploadedImage) {
            setImageSrc(uploadedImage);
        }
    }, [uploadedImage]);

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
            onFileChange(file);
        }
    };

    const renderFileInput = () => (
        <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleChange}
            style={{ display: "none" }}
            id="imageUpload"
        />
    );

    const openFileInput = () => {
        document.getElementById("imageUpload").click();
    };

    return (
        <div className={styles.uploadImage}>
            <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleChange}
                style={{ display: "none" }}
                id="imageUpload"
            />
            <div className={styles.uploadImageContainer}>
                {imageSrc && (
                    <div
                        className={styles.uploadImageChange}
                        onClick={openFileInput}
                    >
                        Change
                    </div>
                )}
                <label
                    htmlFor="imageUpload"
                    className={styles.uploadImageContent}
                >
                    {imageSrc ? (
                        <>
                            <img
                                src={
                                    uploadedImage === imageSrc
                                        ? `${process.env.REACT_APP_R2_PUBLIC_URL}/${imageSrc}`
                                        : imageSrc
                                }
                                alt="Uploaded"
                                className={styles.uploadedImage}
                                onClick={renderFileInput}
                            />
                        </>
                    ) : (
                        <Icon
                            icon="addImage"
                            size="136"
                            className={styles.uploadImageIcon}
                        />
                    )}
                    <div className={styles.uploadImageLabel}>
                        {imageSrc ? "" : "Upload Image"}
                    </div>
                </label>
            </div>
            {error && <div className={styles.uploadImageError}>{error}</div>}
        </div>
    );
}
