import { ArrowRight } from "assets";
import classNames from "classnames";
import CustomButton from "../common/customButton";
import styles from "./style.module.scss";
import { useRouter } from "next/router";
import { routeConstant } from "shared/routes/routeConstant";
interface Props {
  heading: string;
  description: string;
  isAnnual: boolean;
  Icon: any;
  isEducator: boolean;
}

function TrialCard(props: Partial<Props>) {
  const router = useRouter();
  const { Icon, description, heading, isAnnual, isEducator } = props;

  return (
    <>
      <div
        className={classNames(
          styles.cardContainer,
          "d-flex align-items-start px-4 justify-content-center flex-column"
        )}
        style={
          isAnnual ? { backgroundColor: "#EF437B", borderColor: "#EF437B" } : {}
        }
      >
        <div className={classNames("d-flex align-items-center gap-3")}>
          <label
            className={classNames(styles.heading)}
            style={isAnnual ? { color: "white" } : {}}
          >
            {heading}
          </label>
          {Icon && <Icon className={classNames(styles.icon)} />}
        </div>
        <label
          className={classNames(styles.cardDescription)}
          style={isAnnual ? { color: "white" } : {}}
        >
          {description}
        </label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start w-100"
          )}
        >
          {isEducator ? (
            <CustomButton
              title={"Coming Soon"}
              containerStyle={classNames(styles.buttonStyle, "gap-1")}
              style={{ color: "#1897A6" }}
              disabled
            />
          ) : (
            <CustomButton
              title={"See Details"}
              containerStyle={classNames(styles.buttonStyle, "gap-1")}
              IconDirction="right"
              Icon={ArrowRight}
              iconStyle={classNames(
                styles.btnIcon,
                isAnnual && styles.btn2Icon
              )}
              style={isAnnual ? { color: "white" } : { color: "#EF437B" }}
              onClick={() => {
                router.push(routeConstant.plans.path);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default TrialCard;
