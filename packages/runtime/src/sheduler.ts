let isScheduled = false;
const jobs: Array<() => Promise<VoidFunction>> = [];

function enqueueJob(job: () => Promise<VoidFunction>) {
  jobs.push(job);
  scheduleUpdate();
}

function scheduleUpdate() {
  if (isScheduled) {
    return;
  }

  isScheduled = true;
  queueMicrotask(processJobs);
}

function processJobs() {
  while (jobs.length > 0) {
    const job = jobs.shift();
    if (!job) {
      return;
    }

    const result = job();

    Promise.resolve(result).then(
      () => {
        // success
      },
      (error) => {
        console.error(`[scheduler]: ${error}`);
      }
    );
  }

  isScheduled = false;
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve));
}

function nextTick() {
  scheduleUpdate();
  return flushPromises();
}

export { enqueueJob, nextTick };
