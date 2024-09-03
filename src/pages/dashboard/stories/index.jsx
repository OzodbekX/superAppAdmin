import StoriesList from "./list";
import {useSearchParams} from "react-router-dom";
import StoryForm from "@/pages/dashboard/stories/form.jsx";

const Stories = () => {
    const [searchParams, _] = useSearchParams();

    return (
        <div>
            {searchParams?.get("storyId") ? <StoryForm/> :
                <StoriesList/>}
        </div>
    );
}

export default Stories;
  