<script>
    import { selectedNode } from '$lib/store.js';
    import { ProgressBar } from "carbon-components-svelte";
    import { createEventDispatcher } from "svelte";

    export let isActive;

    let isError;
    let errorMsg;
    let errorRows;
    let isProgress;

    let controller = null;
    let signal = null;

    function resetState() {
        isError = false;
        isProgress = false;

        isActive=false;
    }

    resetState();

    const dispatch = createEventDispatcher ();

    function setErrorMsg(msg) {
      let lineRegex = new RegExp('\r?\n');

        errorMsg = msg;
        errorRows = (errorMsg.split(lineRegex)).length;
        if (errorRows == 0){
          errorRows = 1
        } else if (errorRows > 4){
          errorRows = 4;
        }
        isError = true;
    }
    
    async function onRemoveNodeGroupCancel () {
        resetState ();

        if (controller) {
            controller.abort ();
        }
    }

    async function onRemoveNodeGroupOk () {
        controller = new AbortController();
        signal = controller.signal;

        try {
            errorMsg = '';
            isError = false;
            isProgress = true;
            const res = await fetch ('/api/node_groups.json', {
                signal,
                method: 'DELETE',
                body: JSON.stringify({
                    Name: $selectedNode.Name
                })
            });
            isProgress = false;

            if (res.ok) {

                const text = await res.text();
                let isJson = true;
                let json = {};
                try {
                json = JSON.parse (text);
                } catch (e) {
                    isJson = false;
                }
        
                if (isJson) {
                    if (json.status == 0){
                        dispatch ('removeNodeGroupSuccess', {Name: $selectedNode.Name});
                        resetState();
                    } else {
                        console.log(json);
                        setErrorMsg (json.message);
                    }
                } else {
                    isProgress = false;
                    setErrorMsg (text); 
                }
            } else {
                console.log(res);
                setErrorMsg (JSON.stringify(res));
            }
        } catch (e) {
          isProgress = false;
          setErrorMsg (e.toString()); 
        }
    }

</script>

<div class="modal {isActive ? 'is-active' : ''}">
    <div class="modal-background"></div>
    <div class="modal-card box">
        <header>
            <p class="modal-card-title">Remove Folder</p>
        </header>
        <section class="modal-card-body">


            <div class="field">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">Folder</label>
                <div class="control">
                    <input class="input"
                        type="text"
                        value={$selectedNode.Name} 
                        readonly
                        />
                </div>
            </div>


            {#if isProgress}
                <div class="field">
                <div class="control">
                    <ProgressBar helperText=""/>
                </div>
                </div>
            {/if}
    
            {#if isError}
                <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">Error</label>
                    <div class="control">
                    <textarea class="textarea errmsg" placeholder="" rows="{errorRows}" value={errorMsg} readonly/>
                    </div>
                </div>          
            {/if}

            <div class="field is-grouped">
                <div class="control">
                  <button class="button is-info" on:click={onRemoveNodeGroupOk}>Remove</button>
                </div>
                <div class="control">
                  <button class="button is-info is-light" on:click={onRemoveNodeGroupCancel}>Cancel</button>
                </div>
            </div>

        </section>
    </div>
</div>

<style>
    .errmsg {
      background-color: transparent;
      color: red;
      overflow: auto;
    }
</style>