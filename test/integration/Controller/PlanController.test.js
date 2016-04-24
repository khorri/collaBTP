var request = require('supertest');
var should = require('should');
var agent;
describe("PlanController Test", function () {
    var project, plan;
    beforeEach(function (done) {

        Project.find().where({
            'isDeleted': false
        }).then(function (results) {
            project = results[0];
            done();
        }).catch(done);

    });
    beforeEach(function (done) {
        agent = request.agent(sails.hooks.http.app);
        agent.post('/session/create')
            .send({
                email: 'admin@admin.com',
                password: '12345'
            })
            .expect(302)
            .expect('location', '/myspace', done);
    });
    describe('#create()', function () {
        it('should create and return a plan', function (done) {

            agent.post('/plan/create')
                .send({
                    name: 'test Plan',
                    project: project.id
                })
                .expect(function (res) {
                    res.body.should.have.property('id');
                    res.body.should.have.property('name').equal('test Plan');

                })
                .expect(200, done);

        });

        it('should return an error (500)', function (done) {

            agent.post('/plan/create')
                .send({
                    name: 'test Plan'
                })
                .expect(function (res) {
                    res.body.should.have.property('error');

                })
                .expect(500, done);

        });


    });

    describe('#getAll()', function () {
        it('should return an array of all plans', function (done) {

            agent.get('/plan/getAll')
                .expect(function (res) {
                    res.body.should.be.an.Array();
                    if (res.body.length > 0) {
                        plan = res.body[0];
                        plan.should.have.property('versions');
                        plan.should.have.property('deleted').equal(false);
                    }

                })
                .expect(200, done);

        });


    });

    describe("#getByProject()", function () {
        it("Should return plans of project ", function (done) {

            agent.post('/plan/getByProject')
                .send({
                    project: project.id
                })
                .expect(function (res) {
                    res.body.should.be.an.Array();
                    if (res.body.length > 0) {
                        var p = res.body[0];
                        p.should.have.property('versions');
                        p.project.id.should.be.equal(project.id);
                        p.should.have.property('deleted').equal(false);
                    }
                })
                .expect(200, done);
        });
        it("Should return 500 error if project is falsy ", function (done) {

            agent.post('/plan/getByProject')
                .send({
                    project: undefined
                })
                .expect(function (res) {
                    res.body.should.have.property('error');
                })
                .expect(500, done);
        });
    });

    describe("#getById()", function () {
        it("Should return plan of project ", function (done) {

            agent.post('/plan/getById')
                .send({
                    id: plan.id
                })
                .expect(function (res) {
                    res.body.should.be.an.Array();
                    if (res.body.length > 0) {
                        var p = res.body[0];
                        p.should.have.property('versions');
                        p.id.should.be.equal(plan.id);
                        p.should.have.property('deleted').equal(false);
                    }
                })
                .expect(200, done);
        });
        it("Should return 500 error if project is falsy ", function (done) {

            agent.post('/plan/getById')
                .send()
                .expect(function (res) {
                    res.body.should.have.property('error');
                })
                .expect(500, done);
        });
    });

    describe("#update", function () {
        it("Should update a plan and return it", function (done) {

            agent.post('/plan/update')
                .send({
                    id : plan.id,
                    name: 'Updated name',
                    project: project.id,
                    starts: new Date(),
                    ends: new Date(),
                    status: 'processing'
                })
                .expect(function (res) {
                res.body.should.be.an.Array();
                    if (res.body.length > 0) {
                        var p = res.body[0];
                        p.should.have.property('status').equal('processing');
                        p.should.have.property('name').equal('Updated name');
                    }
                })
                .expect(200, done);
        });
        it("Should return 500 error if plan is falsy ", function (done) {

            agent.post('/plan/update')
                .send()
                .expect(function (res) {
                    res.body.should.have.property('error');
                })
                .expect(500, done);
        });
    });
    
    //soft remove
    describe('#remove()',function (){
        it('Set the "deleted" property to true',function(done){
             agent.post('/plan/remove')
                .send({
                    id : plan.id
                })
                .expect(function (res) {
                res.body.should.be.an.Array();
                    if (res.body.length > 0) {
                        var p = res.body[0];
                        p.should.have.property('deleted').equal(true);
                    }
                })
                .expect(200, done);
        });
        
        it("Should return 500 error if plan is falsy ", function (done) {

            agent.post('/plan/remove')
                .send()
                .expect(function (res) {
                    res.body.should.have.property('error');
                })
                .expect(500, done);
        });
    });
    //deep remove
    
    describe('#destroy()',function (){
        it('destroy the plan',function(done){
             agent.post('/plan/destroy')
                .send({
                    id : plan.id
                })
                .expect(function (res) {
                    res.body.should.have.property('msg').equal('Plan supprimé avec succès.');
                })
                .expect(200, done);
        });
    });

});