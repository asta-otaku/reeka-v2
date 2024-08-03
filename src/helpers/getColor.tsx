export const getColor = (status: string) => {
  switch (status) {
    case "ongoing":
      return "#E36B37";
    case "upcoming":
      return "#56CCF2";
    case "done":
      return "#219653";
    case "canceled":
      return "#EB5757";
    default:
      return "#E36B37";
  }
};
