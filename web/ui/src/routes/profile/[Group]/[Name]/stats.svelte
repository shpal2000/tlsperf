<p>stats</p>

<script>
    import { page } from '$app/stores'

    let chartValues = [];
    let chartLabels = [];

    let chartCtxCps;
    let chartCanvasCps;
    let chartCps;

    let chartCtxThpt;
    let chartCanvasThpt;
    let chartThpt;

</script>

<div class="columns is-multiline is-mobile">
    <div class="column is-1"></div>
    <div class="column is-10">
      <div class="tile is-ancestor is-mobile">
        <div class="tile is-6 is-parent">
          <div class="tile is-child my-border">
            <!-- <canvas bind:this={chartCanvasCps} id="cpsChart"></canvas> -->
          </div>
        </div>
        <div class="tile is-6 is-parent">
          <div class="tile is-child my-border">
            <!-- <canvas bind:this={chartCanvasThpt} id="thptChart"></canvas> -->
          </div>
        </div>
      </div>
    </div>
    <div class="column is-1"></div>
</div>