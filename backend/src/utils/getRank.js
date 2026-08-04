const getRank = (points) => {
  if (points >= 5000) {
    return "Community Lead";
  }

  if (points >= 1500) {
    return "Core Contributor";
  }

  if (points >= 500) {
    return "Active Dev";
  }

  if (points >= 100) {
    return "Contributor";
  }

  return "Newbie";
};

export default getRank;
