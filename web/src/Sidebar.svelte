<script>

    import TrafficProfiles from "./TrafficProfiles.svelte";
    import TrafficNodes from "./TrafficNodes.svelte";
</script>

<div class="sidebar">

    <TrafficNodes />

    <TrafficProfiles />

</div>

<style>

    .sidebar {
        height: calc(100vh - 5.25rem);
        border-right: 1px solid lightgrey;
        overflow: scroll;
    }

</style>