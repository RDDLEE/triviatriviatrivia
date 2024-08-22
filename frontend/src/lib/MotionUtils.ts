import { Variants } from "framer-motion";

export default class MotionUtils {
  public static readonly featureContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.5,
      }
    },
  };

  public static readonly featureContainer_Feature: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    }
  };

  public static readonly featureContainer_FeatureIcon: Variants = {
    hidden: {
      opacity: 0,
      scale: 1,
    },
    visible: {
      opacity: 1,
      scale: [1, 1.5, 1],
    }
  };

}
