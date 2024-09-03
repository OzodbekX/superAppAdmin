import React, { useState } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Box,
    Typography,
    Stack,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {Button} from "@material-tailwind/react";

function StorySlideForm({ slide, index, handleChange, handleRemove }) {
    return (
        <Box mb={4} p={2} border={1} borderRadius={2} borderColor="grey.300">
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Slide {index + 1}</Typography>
                <IconButton onClick={() => handleRemove(index)} disabled={index === 0}>
                    <RemoveIcon />
                </IconButton>
            </Stack>

            <Stack spacing={2}>
                <Select
                    fullWidth
                    name={`storySlides[${index}].type`}
                    value={slide.type}
                    onChange={handleChange}
                >
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                </Select>

                {slide.type === 'video' && (
                    <>
                        <TextField
                            fullWidth
                            placeholder="https://..."
                            label="Video URL (Uzb)"
                            name={`storySlides[${index}].videoUrlUzb`}
                            value={slide.videoUrlUzb}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            placeholder="https://..."
                            label="Video URL (Ru)"
                            name={`storySlides[${index}].videoUrlRu`}
                            value={slide.videoUrlRu}
                            onChange={handleChange}
                        />
                    </>
                )}

                <TextField
                    fullWidth
                    placeholder="https://..."
                    label="Image URL (Uzb)"
                    name={`storySlides[${index}].imageUrlUzb`}
                    value={slide.imageUrlUzb}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    placeholder="https://..."
                    label="Image URL (Ru)"
                    name={`storySlides[${index}].imageUrlRu`}
                    value={slide.imageUrlRu}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    label="Duration (seconds)"
                    type="number"
                    name={`storySlides[${index}].duration`}
                    value={slide.duration}
                    onChange={handleChange}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={slide.isActive}
                            onChange={handleChange}
                            name={`storySlides[${index}].isActive`}
                        />
                    }
                    label="Is Active"
                />

                <Select
                    fullWidth
                    label="Clickable Area"
                    name={`storySlides[${index}].clickableArea`}
                    value={slide.clickableArea}
                    onChange={handleChange}
                >
                    <MenuItem value="top">Top</MenuItem>
                    <MenuItem value="middle">Middle</MenuItem>
                    <MenuItem value="bottom">Bottom</MenuItem>
                </Select>

                <TextField
                    fullWidth
                    placeholder="https://..."
                    label="Clickable URL"
                    name={`storySlides[${index}].clickableUrl`}
                    value={slide.clickableUrl || ''}
                    onChange={handleChange}
                />
            </Stack>
        </Box>
    );
}

function StoryForm() {
    const [formData, setFormData] = useState({
        id: 1123,
        isActive: true,
        storySlides: [
            {
                type: 'video',
                videoUrlUzb: '',
                videoUrlRu: '',
                imageUrlUzb: '',
                imageUrlRu: '',
                duration: 360,
                isActive: true,
                clickableArea: 'top',
                clickableUrl: '',
            }
        ],
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const keys = name.split(/[\[\].]/).filter((key) => key !== '');
        setFormData((prevState) => {
            let newData = { ...prevState };
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

    const handleAddSlide = () => {
        setFormData((prevState) => {
            if (prevState.storySlides.length < 30) {
                return {
                    ...prevState,
                    storySlides: [
                        ...prevState.storySlides,
                        {
                            type: 'image',
                            imageUrlUzb: '',
                            imageUrlRu: '',
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
        console.log(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} p={2}>
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    label="ID"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.isActive}
                            onChange={handleChange}
                            name="isActive"
                        />
                    }
                    label="Is Active"
                />

                {formData.storySlides.map((slide, index) => (
                    <StorySlideForm
                        key={index}
                        slide={slide}
                        index={index}
                        handleChange={handleChange}
                        handleRemove={handleRemoveSlide}
                    />
                ))}

                <Button
                    variant="outlined"
                    onClick={handleAddSlide}
                    disabled={formData.storySlides.length >= 30}
                    startIcon={<AddIcon />}
                >
                    Add Slide
                </Button>

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Stack>
        </Box>
    );
}

export default StoryForm;
