const API_URL =
  "http://localhost:3000/api/reservations";

const PRODUCT_ID =
  "cmpjkiiw20003kzeskugktsbb";

const WAREHOUSE_ID =
  "cmpjkihz60000kzesdl3v529i";

const TOTAL_REQUESTS = 5;

async function makeRequest(
  index: number
) {
  try {
    const response = await fetch(
      API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",

          "Idempotency-Key":
            `stress-${index}-${Date.now()}`,
        },

        body: JSON.stringify({
          productId: PRODUCT_ID,
          warehouseId: WAREHOUSE_ID,
          quantity: 1,
        }),
      }
    );

    const data =
      await response.json();

    return {
      index,
      status:
        response.status,
      success:
        response.ok,
      data,
    };
  } catch (err) {
    return {
      index,
      success: false,
      error: err,
    };
  }
}

async function runStressTest() {
  console.log(
    `Running ${TOTAL_REQUESTS} concurrent requests...\n`
  );

  const promises = [];

  for (
    let i = 0;
    i < TOTAL_REQUESTS;
    i++
  ) {
    promises.push(
      makeRequest(i)
    );
  }

  const results =
    await Promise.all(promises);

  const successCount =
    results.filter(
      (r) => r.success
    ).length;

  const failedCount =
    results.filter(
      (r) => !r.success
    ).length;

  console.log(
    "\n===== RESULTS ====="
  );

  console.log(
    `Successful Reservations: ${successCount}`
  );

  console.log(
    `Failed Reservations: ${failedCount}`
  );

  console.log("\nDetails:\n");

  results.forEach((result) => {
    console.log(
      `Request ${result.index}:`,
      result.status,
      result.success
        ? "SUCCESS"
        : "FAILED"
    );
  });
}

runStressTest();