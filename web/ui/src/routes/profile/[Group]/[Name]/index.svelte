<script>
    import { page } from '$app/stores'
    import { DataTable } from "carbon-components-svelte";
    import "carbon-components-svelte/css/white.css";

    let chartValues = [];
    let chartLabels = [];

    let data = {
              labels: chartLabels,
              datasets: [{
                  label: '',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: chartValues
              }]
        };


    const csGroupHeaders = [
      {key: 'Group', value: 'Group'},
      {key: 'Client', value: 'Client'},
      {key: 'Server', value: 'Server'},
      {key: 'Protocol', value: 'Protocol'},
      {key: 'Port', value: 'Port'},
    ];

    const csGroupsData = [
      {id: 1,
        Group: 'Group1',
        Client: '12.51.0.0/16',
        Server: '12.61.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 2,
        Group: 'Group2',
        Client: '12.52.0.0/16',
        Server: '12.62.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 3,
        Group: 'Group3',
        Client: '12.53.0.0/16',
        Server: '12.63.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 4,
        Group: 'Group4',
        Client: '12.54.0.0/16',
        Server: '12.64.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 5,
        Group: 'Group5',
        Client: '12.55.0.0/16',
        Server: '12.65.0.0/16',
        Protocol: 'SSL',
        Port: 443},

        {id: 6,
        Group: 'Group6',
        Client: '12.56.0.0/16',
        Server: '12.66.0.0/16',
        Protocol: 'SSL',
        Port: 443}
    ];

    const statsHeaders = [
      {key: 'Name', value: 'Name'},
      {key: 'Client', value: 'Client'},
      {key: 'Server', value: 'Server'},
    ];

    const statsData = [
      {id: 1,
        Name: 'TcpConnInit',
        Client: 100,
        Server: 0},

        {id: 2,
        Name: 'TcpEstablished',
        Client: 100,
        Server: 100},

        {id: 3,
        Name: 'SslConnInit',
        Client: 100,
        Server: 0},

        {id: 4,
        Name: 'SslEstablished',
        Client: 100,
        Server: 100},

        {id: 5,
        Name: 'ActiveConn',
        Client: 1,
        Server: 1},

        {id: 6,
        Name: 'ResetRcvd',
        Client: 1,
        Server: 1}
    ];
</script>

<div class="columns is-multiline is-mobile breadcrumb-margin">
    <div class="column is-1"></div>
    <div class="column is-10">
      <div class="tile is-ancestor is-mobile">
        <div class="tile is-6 is-parent">
          <div class="tile is-child my-border">
            <section>
              <div class="columns is-multiline is-mobile">
                <div class="column is-half">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">Transactions</label>
                    <div class="control">
                      <input class="input " type="text" placeholder="Text input">
                    </div>
                  </div>
                </div>
      
                <div class="column is-half">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">DataLength</label>
                    <div class="control">
                      <input class="input " type="text" placeholder="Text input">
                    </div>
                  </div>
                </div>
                <br>
                <div class="column is-half">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">CPS</label>
                    <div class="control">
                      <input class="input " type="text" placeholder="Text input">
                    </div>
                  </div>
                </div>
      
                <div class="column is-half">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label ">MaxPipeline</label>
                    <div class="control">
                      <input class="input " type="text" placeholder="Text input">
                    </div>
                  </div>
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button  is-info">Run</button>
                </div>
                <div class="control">
                  <button class="button  is-light">Save</button>
                </div>
              </div>
            </section> 

          </div>
        </div>
        <div class="tile is-6 is-parent">

          <div class="tile is-child my-border">
            <DataTable
            size="short"
            headers={statsHeaders}
            rows={statsData}
            />
          </div>
        </div>
      </div>
    </div>
    <div class="column is-1"></div>

    <div class="column is-1"></div>
    <div class="column is-10">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label ">Traffic Paths:</label>
      <DataTable
        expandable
        headers={csGroupHeaders}
        rows={csGroupsData}
        >
        <div slot="expanded-row" let:row>
          <div class="columns is-multiline is-mobile">
            <div class="column is-2">
            </div>

            <div class="column is-8">
              <div class="columns is-multiline is-mobile">
                <div class="column is-half">
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Client Subnet</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Client IPs</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Protocol</label>
                    <div class="select is-fullwidth is-small">
                      <select class="">
                        <option>TLS</option>
                        <option>TCP</option>
                      </select>
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">TLS Version</label>
                    <div class="select is-fullwidth is-small">
                      <select class="">
                        <option>All</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="column is-half">
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server Subnet</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server IP</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server Port</label>
                    <div class="control">
                      <input class="input is-small" type="text" placeholder="Text input">
                    </div>
                  </div>
                  <br>
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Ciphers</label>
                    <div class="select is-fullwidth is-small">
                      <select class="">
                        <option>All</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server Cert</label>
                    <div class="control cert-key-height">
                      <textarea class="textarea cert-key-height" placeholder="input"></textarea>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="field">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label is-small">Server Key</label>
                    <div class="control cert-key-height">
                      <textarea class="textarea cert-key-height" placeholder="input"></textarea>
                    </div>
                  </div>
                </div>
                <div class="column is-half">
                  <div class="field is-grouped">
                    <div class="control">
                      <button class="button is-small is-info">Save</button>
                    </div>
                    <div class="control">
                      <button class="button is-small is-light">Cancel</button>
                    </div>
                  </div>
                  <br>
                </div>
              </div>
            </div>

            <div class="column is-2">
            </div>
          </div>
        </div>
      </DataTable>
    </div>
    <div class="column is-1"></div>
  </div>


  <style>
    .breadcrumb-margin {
      margin-top: 16px;
      margin-left: 1.1rem;
    }

    .my-border {
      border: 1px solid lightgrey;
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 10px;
      padding-bottom: 15px;
    }

    .inactive-background {
      background-color: whitesmoke;
    }

    .profile-content-margin {
      margin-top: 3rem;
    }

</style>