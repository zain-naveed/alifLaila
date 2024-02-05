import { roles } from "shared/utils/enum";

interface PublishingHouseProps {
  item: any;
}

const PublishingHouse = ({ item }: PublishingHouseProps) => {
  if (item?.partner?.role === roles.author) {
    return item?.partner?.full_name;
  } else if (item?.partner?.role === roles.publisher) {
    return item?.partner?.publishing_house;
  }
};

export default PublishingHouse;
