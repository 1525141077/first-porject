<template>
	<div class="container">
    <div id="main" class="main">
			<NuxtLink to="/projectApproval/projectApprovalList">
			</NuxtLink>
    	<!-- <Logo /> -->
    </div>
		<!-- <div>
			<el-button @click="toDemo">查看模板</el-button>
		</div> -->
  </div>
</template>
<script>
// import Logo from '../components/Logo'
export default {
	data() {
		return {}
	},
	mounted() {},
	created() {},
	methods: {
		toDemo () {
			this.$router.push({
				name: 'demo'
			})
		}
	},
	components: {
		// Logo
	}
}
</script>
<style scoped>
.container {
	display: flex;
	height: 100%;
	justify-content : center;
	align-items : center;
}
.main {
	width: 300px;
	height: 200px;
}
</style>
