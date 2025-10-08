const timeToMeet = (start, end, beginning, duration) => {
  const timeToMinutes = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  const beginningMinutes = timeToMinutes(beginning);
  const finishMinutes = beginningMinutes + duration;

  if (beginningMinutes >= startMinutes && finishMinutes <= endMinutes) {
    return true;
  } else {
    return false;
  }
};

timeToMeet();
