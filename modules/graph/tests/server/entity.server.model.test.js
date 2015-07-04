/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/
'use strict';

var should = require('should'),
	Entity = require('../../server/models/entity.server.model');

describe('Entity Model', function () {

	before(function (done) {
		Entity.removeAll().then(function () {
			done();
		}, function (err) {
			done(err);
		});
	});

	it('Ducktype', function () {
		should(Entity.ducktype()).eql(undefined);
		should(Entity.ducktype({role: 'ABC', '@rid': 'ABC'})).be.instanceof(Entity.Relation);
		should(Entity.ducktype({'@class': 'ABC'})).be.instanceof(Entity);
		should(Entity.ducktype({})).be.instanceof(Object);
	});

	it('Creates Entity', function (next) {

		var NAME = 'M Name',
			URI = 'local://something',
			META = 'etaMeta',
			instance1;

		(new Entity({
			name: NAME,
			uri:  URI,
			meta: META
		})).save().then(function (instance) {

				should.exist(instance);
				should(/^\#\d+\:\d+$/.test(instance.id)).be.true;
				should(instance.uri).eql(URI);
				should(instance.meta).eql(META);
				should(instance.name).eql(NAME);

				instance1 = instance;
				return Entity.getByRID(instance.id);
			}, next)
			.then(function (instance) {
				should.exist(instance);
				should(instance.getValues()).eql(instance1.getValues());

				return Entity.getByURI(instance.uri);
			}, next)
			.then(function (instance) {
				should.exist(instance);
				should(instance.getValues()).eql(instance1.getValues());
				next();
			}, next).catch(next);
	});

	it('Links entities by RIDs', function (next) {

		var nodeA, nodeB,
			LABEL = 'custom link',
			LINK_TYPE = 'Relation';

		(new Entity())
			.save()
			.then(function (entity) {
				nodeA = entity;
				return (new Entity()).save();
			}, next)
			.then(function (entity) {
				nodeB = entity;
				return Entity.link({
					from: nodeA.id,
					to:   nodeB.id,
					role: LABEL,
					type: LINK_TYPE
				});
			})
			.then(function (relation) {
				should(relation).exist;
				should(relation.in.toString()).eql(nodeB.id);
				should(relation.out.toString()).eql(nodeA.id);
				should(relation.role).eql(LABEL);

				return nodeB.in();
			}, next)
			.then(function (nodes) {
				should(nodes).exist;
				should(nodes.length).eql(1);
				should(nodes[0].id.toString()).eql(nodeA.id);

				return nodeB.in(LINK_TYPE);
			}, next)
			.then(function (nodes) {
				should(nodes).exist;
				should(nodes.length).eql(1);
				should(nodes[0].id.toString()).eql(nodeA.id);

				return nodeB.in([LINK_TYPE]);
			}, next)
			.then(function (nodes) {
				should(nodes).exist;
				should(nodes.length).eql(1);
				should(nodes[0].id.toString()).eql(nodeA.id);

				return nodeA.out();
			}, next)
			.then(function (nodes) {
				should(nodes).exist;
				should(nodes.length).eql(1);
				should(nodes[0].id.toString()).eql(nodeB.id);

				return nodeA.out(LINK_TYPE);
			}, next)
			.then(function (nodes) {
				should(nodes).exist;
				should(nodes.length).eql(1);
				should(nodes[0].id.toString()).eql(nodeB.id);

				return nodeA.out([LINK_TYPE]);
			}, next)
			.then(function (nodes) {
				should(nodes).exist;
				should(nodes.length).eql(1);
				should(nodes[0].id.toString()).eql(nodeB.id);

				next();

			}, next)
			.catch(next);

	});

	it('Handle wrong links', function (next) {

		var invalid = function () {
			next(new Error('Invalid resolve'));
		};

		Entity.link().then(invalid, function (exception) {
			should.exist(exception);
			should(exception.message).eql('Empty options');
			return Entity.link({});
		}).then(invalid, function (exception) {
			should.exist(exception);
			should(exception.message).eql('From is not set');
			return Entity.link({from: 'A'});
		}).then(invalid, function (exception) {
			should.exist(exception);
			should(exception.message).eql('To is not set');
			next();
		})
			.catch(next);
	});

	it('Relation', function (next) {
		(new Entity.Relation({
			role:   'ABC',
			'@rid': 'ABC',
			in:     'DEF',
			out:    'GHI'
		})).getOut().then(function () {
				next();
			}, next).catch(next);
	});

	it('Digs', function (next) {

		var nodeA, nodeB, nodeC, nodeD;

		(new Entity({
			name: 'www.example.com'
		})).save().then(function (entity) {
				nodeA = entity;
				return (new Entity({
					name: 'example.com'
				})).save();
			}, next)
			.then(function (entity) {
				nodeB = entity;
				return (new Entity({
					name: '127.0.0.1'
				})).save();
			}, next)
			.then(function (entity) {
				nodeC = entity;
				return (new Entity({
					name: 'INSTANCE A'
				})).save();
			}, next)
			.then(function (entity) {
				nodeD = entity;
				return nodeA.linkTo(nodeB, 'Relation', 'CNAME Record');
			}, next)
			.then(function () {
				return nodeB.linkTo(nodeC, 'Relation', 'A Record');
			}, next)
			.then(function () {
				return nodeC.linkTo(nodeD, 'Relation', 'EC2');
			})
			.then(function () {
				return nodeA.dig({
					name: 'INSTANCE A'
				});
			}, next)
			.then(function (results) {
				should(results).exist;
				should(results.length).eql(1);
				should(results[0].id).eql(nodeD.id);
				return nodeA.dig({
					role: 'EC2'
				});
			}, next)
			.then(function (results) {
				should(results).exist;
				should(results.length).eql(1);
				should(results[0].id).eql(nodeD.id);
				next();
			}, next)
			.catch(next);

	});

	it('Query builder with like works', function (next) {

		var nodeA, nodeB, nodeC, nodeD;

		(new Entity({
			name: 'www.example.com'
		})).save().then(function (entity) {
				nodeA = entity;
				return (new Entity({name: 'example.com'})).save();
			}, next)
			.then(function (entity) {
				nodeB = entity;
				return (new Entity({name: '127.0.0.1'})).save();
			}, next)
			.then(function (entity) {
				nodeC = entity;
				return (new Entity({name: 'INSTANCE A'})).save();
			}, next)
			.then(function (entity) {
				nodeD = entity;
				return nodeA.linkTo(nodeB, 'Relation', 'CNAME Record');
			}, next)
			.then(function () {
				return nodeB.linkTo(nodeC, 'Relation', 'A Record');
			}, next)
			.then(function () {
				return nodeC.linkTo(nodeD, 'Relation', 'EC2');
			})
			.then(function () {
				return Entity.queryList(Entity.buildQuery({
					filters: {
						name: 'LIKE'
					}
				}), {
					name: 'instance%'
				});
			})
			.then(function () {
				return nodeA.json({
					depth: 2
				});
			}, next)
			.then(function () {
				next();
			}, next)
			.catch(next);


	});
});
