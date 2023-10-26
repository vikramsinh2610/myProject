import { ListGroup } from "react-bootstrap";
import moment from "moment";
import Image from "next/image";
import { getActivityDisplayName } from "../../helpers/utils";
import { format } from "react-string-format";

const ActivityLog = ({ card, activities, currentUser }: any) => {
  return (
    <ListGroup variant={"flush"}>
      {activities &&
        activities?.map((activity: any) => {
          return (
            <ListGroup.Item key={activity._id} className="d-flex gap-3 mt-3">
              <Image
                src={
                  activity.actor?.profilePhoto ||
                  `/static/img/logos/logo-square.png`
                }
                width={50}
                height={50}
                alt={"profile photo"}
              ></Image>
              <div>
                <h6 className="mb-0">
                  {format(
                    activity.content.replace("actor", 0),
                    getActivityDisplayName(activity, currentUser)
                  )}
                </h6>
                <small className="opacity-50 text-nowrap">
                  {moment(activity.createdAt).format("LL")}
                </small>
              </div>
            </ListGroup.Item>
          );
        })}
    </ListGroup>
  );
};

export default ActivityLog;
