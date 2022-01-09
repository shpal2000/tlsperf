<script>
    export let isActive;
    let Name = '';
    let Notes = '';
    let Results = '';

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher ();

    async function onAddNodeGroupSuccess () {

      const res = await fetch ('/api/node_groups', {
        method: 'POST',
        body: JSON.stringify({
          Name,
          Notes
        })
      });

      if (res.ok) {
        const json = await res.json();

        if (json.status == 0){
          dispatch ('addNodeGroupSuccess', {Name: Name});
          isActive=false;
        } else {
          console.log(json);
          alert (JSON.stringify(json))
        }
      } else {
        console.log(res);
        alert (JSON.stringify(res))
      }
    }
</script>

<div class="modal {isActive ? 'is-active' : ''}">
    <div class="modal-card box">
      <header>
        <p class="modal-card-title">Add Node Group</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Text input" bind:value={Name}>
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Notes</label>
          <div class="control">
            <textarea class="textarea" placeholder="Textarea" bind:value={Notes}></textarea>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-info" on:click={onAddNodeGroupSuccess}>Add</button>
          </div>
          <div class="control">
            <button class="button is-info is-light" on:click={() => isActive=false}>Cancel</button>
          </div>
        </div>
      </section>
    </div>
</div>

<style>

</style>