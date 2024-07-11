import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare, faComment } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/landing/profile-pictures/user1.jpg";
import postImage1 from "./assets/postImage1.jpg";
import postImage2 from "./assets/postImage2.jpg";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Input,
  Typography,
} from "@mui/material";
const RightSideBar = () => {
  return (
    <div>
      <Card className="bg-gray-800 text-white mb-4 shadow-lg rounded-lg">
        <CardContent>
          <div className="flex items-center mb-4">
            <Avatar src={avatar} alt="avatar" className="w-12 h-12" />
            <div className="ml-4">
              <Typography variant="h6" className="font-bold text-lg">
                Dr. Mike Smith
              </Typography>
              <Typography variant="subtitle2" className="text-gray-400">
                Cardiologist, MBBS
              </Typography>
            </div>
          </div>
          <Typography className="mb-4 text-sm leading-relaxed">
            Hi! I am Dr. Mike Smith, a renowned cardiologist with over 20 years
            of experience. I specialize in heart disease prevention, diagnosis,
            and treatment. I have published numerous research papers and am
            highly respected in the medical community.
          </Typography>
          <div className="bg-blue-700 p-4 rounded-lg mb-4 h-96">
            <Typography className="text-sm">content</Typography>
          </div>
          {/* Uncomment and replace postImage1, postImage2 with your image sources
      <div className="flex space-x-4 mb-4">
        <img src={postImage1} alt="post" className="w-1/2 rounded-lg object-cover" />
        <img src={postImage2} alt="post" className="w-1/2 rounded-lg object-cover" />
      </div>
      */}
          <div className="flex items-center space-x-4 mb-4 text-gray-400">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-base cursor-pointer w-6 hover:text-red-500"
            />
            <FontAwesomeIcon
              icon={faComment}
              className="text-base cursor-pointer w-6 hover:text-blue-500"
            />
            <FontAwesomeIcon
              icon={faShare}
              className="text-base cursor-pointer w-6 hover:text-green-500"
            />
            <Typography className="text-sm">100 likes</Typography>
          </div>
          <Input placeholder="Add a comment..." className="w-full text-white" />
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSideBar;
