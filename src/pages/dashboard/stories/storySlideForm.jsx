import {Box, Checkbox, FormControlLabel, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {IconButton} from "@material-tailwind/react";
import RemoveIcon from "@mui/icons-material/Remove.js";
import React from "react";
import UploadPreviewComponent from "@/pages/dashboard/stories/uploadPreviewComponent.jsx";
import {useQuery} from "@tanstack/react-query";

export default function StorySlideForm({
                                           slide,
                                           index,
                                           handleChange,
                                           handleFileChange,
                                           formData,
                                           isLastOne,
                                           handleRemove
                                       }) {


    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['repoData'],
        queryFn: async () => {
            const response = await fetch(
                'https://api.github.com/repos/TanStack/query',
            )
            return await response.json()
        },
    })
    console.log({ isPending, error, data, isFetching })


    return (
        <Box mb={4} p={2} border={1} borderRadius={2} borderColor="grey.300">
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Slide {index + 1}</Typography>
                <IconButton onClick={() => handleRemove(index)} disabled={isLastOne}>
                    <RemoveIcon/>
                </IconButton>
            </Stack>

            <Stack spacing={2}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Select
                        variant={"outlined"}
                        fullWidth
                        style={{width: "50%"}}
                        name={`storySlides[${index}].type`}
                        value={slide.type}
                        onChange={handleChange}
                    >
                        <MenuItem value="video">Video</MenuItem>
                        <MenuItem value="image">Image</MenuItem>
                    </Select>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color={"dark"}
                                checked={slide.isActive}
                                onChange={handleChange}
                                name={`storySlides[${index}].isActive`}
                            />
                        }
                        style={{width: '50%'}}
                        label="Is Active"
                    />
                </Box>

                {slide.type === 'video' && (
                    <>
                        <Box
                            sx={{display: 'flex', gap: 2}}>
                            <UploadPreviewComponent
                                fileUrl={formData.storySlides[index]?.videoUrlUzb}
                                handleChange={handleChange}
                                title={"video uzb"}
                                name={`storySlides[${index}].videoUrlUzb`}
                                type={"video"}/>
                            <UploadPreviewComponent
                                 handleChange={handleChange}
                                fileUrl={formData.storySlides[index]?.imageUrlUzb}
                                title={"image uzb"}
                                name={`storySlides[${index}].imageUrlUzb`}
                                type={"image"}/>
                        </Box>
                        <Box
                            sx={{display: 'flex', alignItems: 'start', gap: 2}}>

                            <UploadPreviewComponent

                                  handleChange={handleChange}
                                fileUrl={formData.storySlides[index]?.videoUrlRu} title={"video ru"}
                                name={`storySlides[${index}].videoUrlRu`}
                                type={"video"}/>
                            <UploadPreviewComponent

                                handleChange={handleChange}
                                fileUrl={formData.storySlides[index]?.imageUrlRu}
                                title={"image ru"}
                                name={`storySlides[${index}].imageUrlRu`}
                                type={"image"}/>

                        </Box>

                    </>
                )}

                {slide.type === 'image' && (
                    <Box

                        sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <UploadPreviewComponent handleChange={handleChange}
                                                fileUrl={formData.storySlides[index]?.imageUrlUzb} title={"image uzb"}
                                                name={`storySlides[${index}].imageUrlUzb`}
                                                type={"image"}/>
                        <UploadPreviewComponent handleChange={handleChange}
                                                fileUrl={formData.storySlides[index]?.imageUrlRu} title={"image ru"}
                                                name={`storySlides[${index}].imageUrlRu`}
                                                type={"image"}/>
                    </Box>
                )}


                <Box
                    sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <TextField
                        fullWidth
                        label="Duration (milli sec.)"
                        type="number"
                        name={`storySlides[${index}].duration`}
                        value={slide.duration}
                        onChange={handleChange}
                    />

                    <Select
                        variant={"outlined"}
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
                </Box>

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
