import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import { fData } from 'utils/formatNumber';
import { memo, useCallback, useEffect, useState } from 'react';
import useIsMountedRef from 'hooks/useIsMountedRef';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { AddAPhoto as AddAPhotoIcon } from '@mui/icons-material';
import classes from './styles.module.scss';
import ErrorMessage from 'components/common/texts/ErrorMessage';
import { Button, Col, Row } from 'reactstrap';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BtnType } from 'components/common/buttons/Button';
import { title } from 'process';

const PHOTO_SIZE = 3145728; // bytes
const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

interface UploadImageProps {
  disabled?: boolean;
  caption?: string;
  errorMessage?: string;
  file?: string[] | File[];
  onChange?: (file: string[] | File[]) => void;
  className?: string;
  photoSize?: number;
  fileFormats?: string[];
  square?: boolean;
  align?: 'center' | 'left';
  title?: string;
}
// eslint-disable-next-line react/display-name
const UploadImage = memo(
  ({
    disabled,
    caption,
    errorMessage,
    file,
    onChange,
    className,
    photoSize = PHOTO_SIZE,
    fileFormats = FILE_FORMATS,
    square,
    align = 'center',
    title,
    ...other
  }: UploadImageProps) => {
    const [isError, setIsError] = useState<string>('');
    const isMountedRef = useIsMountedRef();
    const [fileReview, setFileReview] = useState([]);

    const handleDrop = useCallback(
      async (acceptedFiles) => {
        let arrImg = [];
        for (const file of acceptedFiles) {
            const checkSize = file.size < photoSize;
            const checkType = fileFormats.includes(file.type);
            if (!checkSize) {
              setIsError('size-invalid');
              return
            }
            if (!checkType) {
              setIsError('type-invalid');
              return
            }
            setIsError('');
            arrImg.push(file)
        }
        onChange && onChange([...file, ...arrImg])
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onChange]
    );

    useEffect(() => {
      for(const it of file) {
        if (!!it && typeof it === "object") {
            const reader = new FileReader();
            reader.readAsDataURL(it);
            reader.onload = () => setFileReview((prevState) => [...prevState, reader.result]);
          } 
        else {
            setFileReview((prevState) => [...prevState, it])
        }
      }
      
    }, [file])
    console.log(fileReview);
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragReject,
      isDragAccept,
    } = useDropzone({
      onDrop: handleDrop,
      disabled: disabled,
    });

    return (
      <>
        <Row className={clsx("mb-2",classes.row)}>
            <Col>
                <p className={classes.titleUpload}>{title}</p>
                    <div className={classes.main} {...getRootProps()}>
                        <div className={classes.listImageContainer}>
                            {fileReview?.length > 0 && <Row className={classes.rowImg}>
                                {fileReview?.map((image: string | undefined, index: React.Key | null | undefined) => 
                                    (<Col xs={3} key={index} className={classes.imageContainer}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img  alt="anh" src={image} className="selected-iamges"/>
                                    {/* <div onClick={() => onDelete(image)} className={classes.deleteImage}><FontAwesomeIcon icon={faCircleXmark}/></div>  */}
                                    </Col>) 
                                    )}
                                  </Row>
                                }
                              </div>
                              <Button className={classes.dropZone} btnType={BtnType.Primary}>
                              <input {...getInputProps()} className={classes.input} name="images"/>
                              {isDragActive ? 'Drag active' : "Choose your images"}
                              </Button>
                              {isError === 'size-invalid' && <ErrorMessage translation-key="common_file_size">size: {fData(PHOTO_SIZE) }</ErrorMessage>}
                              {/* {isError === 'max-invalid' && <ErrorMessage>You can upload only {MAX_IMAGES} images</ErrorMessage>} */}
                              {/* {isError === 'min-invalid' && <ErrorMessage>You must upload minimum {MIN_IMAGES} images</ErrorMessage>}                   */}
                              {isError === 'type-invalid' &&
                                (
                                  <ErrorMessage  translation-key="common_file_type">
                                    Please choose following format: {" "}
                                    {
                                        FILE_FORMATS.map(format => (
                                          format.replace("image/", "*.")
                                        )).join(", ")
                                    }
                                  </ErrorMessage>
                            )
                        }
                        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage> }
                    </div>
                </Col>
            </Row>
      </>
    );
  }
);

export default UploadImage;
