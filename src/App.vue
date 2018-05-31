<template lang="pug">
  b-container
    b-row
      b-col
        b-jumbotron
          template(slot="header") Simple Genetic

    b-row
      b-col(cols="4")
        b-card
          h6(slot="header") Set Configuration
          b-form
            b-form-group(label="Min x")
              b-form-input(
                v-model="x.min",
                :state="inputs.x.min.state")

              b-form-invalid-feedback {{ inputs.x.min.msg }}

            b-form-group(label="Max x")
              b-form-input(
                v-model="x.max",
                :state="inputs.x.max.state")

              b-form-invalid-feedback {{ inputs.x.max.msg }}

            b-form-group(label="Population Size")
              b-form-input(
                v-model="geneticOptions.populationSize",
                :state="inputs.populationSize.state")

              b-form-invalid-feedback {{ inputs.populationSize.msg }}

            b-form-group(label="Formula")
              b-form-radio-group(
                v-model="selectedFormula",
                :options="formulaRadios",
                stacked)

            b-button(@click="reload") Reload Genetic
            b-button(@click="evolve") Evolve

      b-col(cols="4")
        b-card(no-body)
          h6(slot="header") Current Configuration
          pre(v-highlightjs="configs")
            code.json

      b-col(cols="4")
        b-card(no-body)
          h6(slot="header") Best Individual
          pre(v-highlightjs="best")
            code.json
</template>

<script>
import Genetic from 'algoritma-genetika';
import random from 'lodash.random';

export default {
  name: 'app',
  data() {
    return {
      maxInput: 1000,
      inputs: {
        x: {
          min: {
            state: '',
            msg: '',
          },
          max: {
            state: '',
            msg: '',
          },
        },
        populationSize: {
          state: '',
          msg: '',
        },
      },
      selectedFormula: 0,
      formulas: [
        x => x ** 2,
        x => ((x ** 2) + (2 * x)) - 1,
      ],
      formulasString: [
        'f(x) = x^2',
        'f(x) = x^2 + 2x - 1',
      ],
      x: {
        min: -50,
        max: 50,
      },
      geneticOptions: {
        populationSize: 10,
        populationFunction: () => ({
          x: random(this.x.min, this.x.max, true),
        }),
        crossoverFunction: (a, b) => [
          {
            x: random(a.x, this.x.max, true),
          },
          {
            x: random(b.x, this.x.max, true),
          },
        ],
        mutationFunction: a => ({
          x: random(a.x, this.x.max, true),
        }),
        fitnessFunction: i => this.formulas[this.selectedFormula](i.x),
      },
      genetic: {},
      loadedConfigs: {},
    };
  },
  mounted() {
    this.genetic = new Genetic(this.geneticOptions);
    this.loadedConfigs = {
      x: {
        min: parseInt(this.x.min, 10),
        max: parseInt(this.x.max, 10),
      },
      populationSize: Math.abs(this.geneticOptions.populationSize),
      formula: this.formulasString[this.selectedFormula],
      crossover: '(ind1, ind2) => [{x: random(ind1.x, x.max)}, {x: random(ind2.x, x.max)}]',
      mutation: '(ind) => {x: random(ind.x, x.max)}',
    };
  },
  computed: {
    sourcecode() {
      return JSON.stringify([], null, 2);
    },
    configs() {
      return JSON.stringify(this.loadedConfigs, null, 2);
    },
    formulaRadios() {
      return this.formulasString.map((s, i) => ({
        text: s,
        value: i,
      }));
    },
    best() {
      if (this.genetic.state === Genetic.state.initial) {
        return JSON.stringify({});
      }

      return JSON.stringify(this.genetic.best, null, 2);
    },
  },
  methods: {
    reload() {
      const { x: inputX, populationSize: inputPop } = this.inputs;
      if (inputX.min.state === 'invalid' || inputX.max.state === 'invalid' || inputPop.state === 'invalid') {
        alert('Please review your input');
      } else {
        this.genetic = new Genetic(this.geneticOptions);
        this.loadedConfigs = {
          x: {
            min: parseInt(this.x.min, 10),
            max: parseInt(this.x.max, 10),
          },
          populationSize: Math.abs(this.geneticOptions.populationSize),
          formula: this.formulasString[this.selectedFormula],
          crossover: '(ind1, ind2) => [{x: random(ind1.x, x.max)}, {x: random(ind2.x, x.max)}]',
          mutation: '(ind) => {x: random(ind.x, x.max)}',
        };
      }
    },
    evolve() {
      this.genetic.evolve();
      this.best = this.genetic.best;
    },
  },
  watch: {
    'x.min': function xMin(to) {
      if (Math.abs(to) > this.maxInput || !parseInt(to, 10)) {
        this.inputs.x.min.state = 'invalid';
        this.inputs.x.min.msg = 'Min x is -1000';
      } else {
        this.inputs.x.min.state = 'valid';
      }
    },
    'x.max': function xMax(to) {
      if (Math.abs(to) > this.maxInput || !parseInt(to, 10)) {
        this.inputs.x.max.state = 'invalid';
        this.inputs.x.max.msg = 'Max x is 1000';
      } else {
        this.inputs.x.max.state = 'valid';
      }
    },
    'geneticOptions.populationSize': function populationSize(to) {
      if (Math.abs(to) > this.maxInput || !parseInt(to, 10)) {
        this.inputs.populationSize.state = 'invalid';
        this.inputs.populationSize.msg = 'Max population size is -1000';
      } else {
        this.inputs.populationSize.state = 'valid';
      }
    },
  },
};
</script>

<style>
pre {
  margin-bottom: 0;
}
</style>
