const expect = require('chai').expect
const rewire = require('rewire')
const test = rewire('../src/countPoints.js')
const yahtzee = test.__get__('yahtzee')
const sequence = test.__get__('sequence')
const threePairs = test.__get__('threePairs')
const noTriplets = test.__get__('noTriplets')
const countPoints = require('../src/countPoints')


describe('helper functions...', function () {

  it('yahtzee returns true when all 6 dice are the same', function () {
    expect(yahtzee([1, 1, 1, 1, 1, 1])).to.equal(true)
    expect(yahtzee([1, 1, 1, 1, 1, 2])).to.equal(false)
    expect(yahtzee([1, 1, 1, 1, 1])).to.equal(false)
  })

  it('sequence returns true when all 6 dice are different', function () {
    expect(sequence([1, 2, 3, 4, 5, 6])).to.equal(true)
    expect(sequence([1, 3, 5, 2, 4, 6])).to.equal(true)
    expect(sequence([1, 2, 3, 4, 5, 5])).to.equal(false)
    expect(sequence([1, 2, 3, 4, 5])).to.equal(false)
  })

  it('three pairs returns true only when there are 3 pairs', function () {
    expect(threePairs([1, 1, 2, 2, 3, 3])).to.equal(true)
    expect(threePairs([1, 2, 3, 1, 2, 3])).to.equal(true)
    expect(threePairs([1, 1, 2, 2, 3, 4])).to.equal(false)
    expect(threePairs([1, 1, 2, 2])).to.equal(false)
  })

  it('noTriplets returns a new array with triplets removed', function () {
    expect(noTriplets([1, 2, 3, 4, 5, 6])).to.deep.equal([1, 2, 3, 4, 5, 6])
    expect(noTriplets([1, 1, 1, 4, 5, 6])).to.deep.equal([4, 5, 6])
    expect(noTriplets([1, 1, 1, 4, 4, 4])).to.deep.equal([])
    expect(noTriplets([1, 1, 1, 1, 4, 4])).to.deep.equal([1, 4, 4])
    expect(noTriplets([1, 1, 1, 1, 1, 1])).to.deep.equal([])
  })

})



describe('countPoints should...', function () {

  it('return 5000 when all 6 dice are the same', function () {
    expect(countPoints([1, 1, 1, 1, 1, 1])).to.equal(5000)
    expect(countPoints([2, 2, 2, 2, 2, 2])).to.equal(5000)
    expect(countPoints([3, 3, 3, 3, 3, 3])).to.equal(5000)
    expect(countPoints([4, 4, 4, 4, 4, 4])).to.equal(5000)
    expect(countPoints([5, 5, 5, 5, 5, 5])).to.equal(5000)
    expect(countPoints([6, 6, 6, 6, 6, 6])).to.equal(5000)
  })

  it('not return 5000 when dice are all the same, but not 6 dice', function () {
    expect(countPoints([1, 1, 1, 1, 1])).to.not.equal(5000)
  })

  it('return 2000 when all 6 dice are a sequence', function () {
    expect(countPoints([1, 2, 3, 4, 5, 6])).to.equal(2000)
    expect(countPoints([2, 4, 3, 5, 1, 6])).to.equal(2000)
  })

  it('not return 2000 when less than 6 dice form a sequence', function () {
    expect(countPoints([1, 2, 3, 4, 5])).to.not.equal(2000)
  })

  it('return 1200 when dice form three pairs', function () {
    expect(countPoints([1, 1, 2, 2, 3, 3])).to.equal(1200)
    expect(countPoints([1, 1, 1, 1, 2, 2])).to.equal(1200)
  })

  it('not return 1200 when dice form pairs, but are less than 6', function () {
    expect(countPoints([1, 1, 2, 2, 3])).to.not.equal(1200)
    expect(countPoints([1, 1, 2, 2])).to.not.equal(1200)
    expect(countPoints([1, 1])).to.not.equal(1200)
  })

  it('return 1000 when there are 3 aces', function () {
    expect(countPoints([1, 1, 1, 2, 2, 3])).to.equal(1000)
    expect(countPoints([1, 1, 1, 2])).to.equal(1000)
    expect(countPoints([1, 1, 1])).to.equal(1000)
  })

  it('return x*100 when there are 3 of a kind', function () {
    expect(countPoints([2, 2, 2, 3, 3, 4])).to.equal(200)
    expect(countPoints([3, 3, 3, 4, 4, 2])).to.equal(300)
    expect(countPoints([4, 4, 4, 2, 2, 3])).to.equal(400)
    expect(countPoints([5, 5, 5, 2, 2, 3])).to.equal(500)
    expect(countPoints([6, 6, 6, 2, 2, 3])).to.equal(600)
    expect(countPoints([2, 2, 2, 3])).to.equal(200)
    expect(countPoints([2, 2, 2])).to.equal(200)
  })

  it('return the total of two triplets', function () {
    expect(countPoints([1, 1, 1, 5, 5, 5])).to.equal(1500)
    expect(countPoints([1, 1, 1, 2, 2, 2])).to.equal(1200)
    expect(countPoints([2, 2, 2, 3, 3, 3])).to.equal(500)
  })

  it('return the triplet total plus remaining ones and fives', function () {
    expect(countPoints([1, 1, 1, 2, 3, 4])).to.equal(1000)
    expect(countPoints([1, 1, 1, 2, 3, 5])).to.equal(1050)
    expect(countPoints([1, 1, 1, 2, 5, 5])).to.equal(1100)
    expect(countPoints([1, 1, 1, 1, 3, 4])).to.equal(1100)
    expect(countPoints([1, 1, 1, 1, 5, 5])).to.equal(1200)
    expect(countPoints([1, 1, 1, 1, 1, 5])).to.equal(1250)
  })

})