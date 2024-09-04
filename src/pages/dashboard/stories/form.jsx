import React, {useState} from 'react';
import {Box, Button, Checkbox, FormControlLabel, MenuItem, Select, Stack, TextField, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {IconButton} from "@material-tailwind/react";
import {ArrowBack} from "@mui/icons-material";
import {useSearchParams} from "react-router-dom";
import StorySlideForm from "@/pages/dashboard/stories/storySlideForm.jsx";



function StoryForm() {
    const [formData, setFormData] = useState({
        id: 1123,
        isActive: true,
        storySlides: [
            {
                type: 'video',
                videoUrlUzb: null,
                videoUrlRu: null,
                imageUrlUzb: null,
                imageUrlRu: null,
                duration: 360,
                isActive: true,
                clickableArea: 'top',
                clickableUrl: '',
            }
        ],
    });
    const [_, setSearchParams] = useSearchParams();

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        const keys = name.split(/[\[\].]/).filter((key) => key !== '');
        setFormData((prevState) => {
            let newData = {...prevState};
            let current = newData;
            keys.forEach((key, idx) => {
                if (idx === keys.length - 1) {
                    current[key] = type === 'checkbox' ? checked : value;
                } else {
                    current = current[key];
                }
            });
            return newData;
        });
    };

    const handleFileChange = (event, index, key) => {
        const file = event.target.files[0];
        setFormData((prevState) => {
            const newSlides = [...prevState.storySlides];
            newSlides[index][key] = file;
            return {
                ...prevState,
                storySlides: newSlides,
            };
        });
    };

    const handleAddSlide = () => {
        setFormData((prevState) => {
            if (prevState.storySlides.length < 30) {
                return {
                    ...prevState,
                    storySlides: [
                        ...prevState.storySlides,
                        {
                            type: 'image',
                            imageUrlUzb: null,
                            imageUrlRu: null,
                            duration: 120,
                            isActive: true,
                            clickableArea: 'top',
                            clickableUrl: '',
                        },
                    ],
                };
            }
            return prevState;
        });
    };

    const handleRemoveSlide = (index) => {
        setFormData((prevState) => {
            const updatedSlides = prevState.storySlides.filter((_, i) => i !== index);
            return {
                ...prevState,
                storySlides: updatedSlides,
            };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };
    console.log({formData})

    const removeFile = (event) => {
        const {name, value, type, checked} = event.target;
        const keys = name.split(/[\[\].]/).filter((key) => key !== '');
        setFormData((prevState) => {
            let newData = {...prevState};
            let current = newData;
            keys.forEach((key, idx) => {
                if (idx === keys.length - 1&&current[key]) {
                    current[key] = type === 'checkbox' ? checked : value;
                } else {
                    current = current[key];
                }
            });
            return newData;
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} p={2}>
            <Stack spacing={3}>
                <Box  sx={{display: 'flex', justifyContent: "space-between", alignItems: 'center', gap: 2}}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color={"dark"}
                                checked={formData.isActive}
                                onChange={handleChange}
                                name="isActive"
                            />
                        }
                        label="Is Active"
                    />
                    <IconButton onClick={() => setSearchParams()}>
                        <ArrowBack/>
                    </IconButton>
                </Box>
                {formData.storySlides.map((slide, index) => (
                    <StorySlideForm
                        isLastOne={formData.storySlides.length === 1}
                        slide={slide}
                        index={index}
                        removeFile={removeFile}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                        handleRemove={handleRemoveSlide}
                        formData={formData}
                    />
                ))}

                <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', gap: 2}}>
                    <Button
                        color={"dark"}
                        variant="outlined"
                        onClick={handleAddSlide}
                        disabled={formData.storySlides.length >= 30}
                        startIcon={<AddIcon/>}
                    >
                        Add Slide
                    </Button>

                    <Button color={"dark"} type="submit" variant="contained">
                        Submit
                    </Button>
                </Box>


            </Stack>
        </Box>
    );
}

export default StoryForm;
