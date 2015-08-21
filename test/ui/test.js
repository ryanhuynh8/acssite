var should = require('chai').should(),
    fs = require('fs');

var webdriver = require('browserstack-webdriver'),
    test = require('browserstack-webdriver/testing');

var driver, server;
var baseUrl = 'http://acsdev.ddns.net:8080/';

test.before(function() {
    var capabilities = {
        'browserName': 'chrome',
        'browserstack.user': 'kyohiros1',
        'browserstack.key': 'Lk8oKD9hZQUyF3kmaXqQ'
    };

    driver = new webdriver.Builder().
    usingServer('http://hub.browserstack.com/wd/hub').
    withCapabilities(capabilities).
    build();
});

test.describe('Main Page', function() {
    test.it('should load main page', function(done) {
        driver.get(baseUrl);
        driver.getTitle().then(function(title) {
            title.should.be.equal('ACS Absolute Comfort Management System');
        });
    });

    test.it('should immediately redirect to login page', function(done) {
        driver.getCurrentUrl().then(function(url) {
            url.should.include('login');
        });
    });

    test.it('should show error with incorrect login information', function(done) {
        driver.findElement(webdriver.By.id('user_name')).sendKeys('foo');
        driver.findElement(webdriver.By.id('password')).sendKeys('bar');
        driver.findElement(webdriver.By.className('btn-primary')).click();
        driver.sleep(2000);
        driver.findElement(webdriver.By.className('alert')).getText().then(function(text) {
            text.should.be.equal('Wrong username or password, please try again.');
        });
    });

    test.it('should log in and redirect to main page with correct information', function(done) {
        driver.navigate().refresh();
        driver.findElement(webdriver.By.id('user_name')).sendKeys('mike');
        driver.findElement(webdriver.By.id('password')).sendKeys('123');
        driver.findElement(webdriver.By.className('btn-primary')).click();

        driver.sleep(10000);

        driver.findElement(webdriver.By.css('#topnav > ul > li:nth-child(3)')).getText().then(function (text) {
            text.should.be.equal('Welcome, Mike Phan');
        });
    });
});

// test.describe('New Announcement Page', function() {
//     test.it('should load new announcement page', function(done) {
//         driver.findElement(webdriver.By.id('headerbardropdown')).click();

//         driver.findElement(webdriver.By.css('#headerbar > div > div > div:nth-child(1) > a')).click();
//         driver.sleep(3000);

//         driver.findElement(webdriver.By.css('#page-heading > h1')).getText().then(function (text) {
//             text.should.be.equal('New Annoucement');
//         });
//     });

//     test.it('should display error when submit with empty fields', function(done) {
//         driver.findElement(webdriver.By.css('#create_button')).click();
//         driver.findElement(webdriver.By.className('alert')).getText().then(function(text) {
//             text.should.be.equal('Invalid date or empty description.');
//         });
//     });

//     test.it('should be able to submit new announcement with default dates', function(done) {
//         driver.findElement(webdriver.By.css('#task_description')).clear();
//         driver.findElement(webdriver.By.css('#task_description')).sendKeys('foo');
//         driver.findElement(webdriver.By.css('#create_button')).click();
//         driver.sleep(1000);
//         driver.findElement(webdriver.By.className('alert')).getText().then(function(text) {
//             text.should.be.equal('New announcement added successfully. Redirecting to dashboard now...');
//         });

//         driver.sleep(2000);
//     });

//     test.it('should redirect to main page after creating new announcement', function(done) {
//         driver.getCurrentUrl().then(function(url) {
//             url.should.be.equal(baseUrl + '#/');
//         });
//     });
// });

// test.describe('New Task Page', function() {
//     test.it('should load new task page', function(done) {
//         driver.findElement(webdriver.By.id('headerbardropdown')).click();
//         driver.findElement(webdriver.By.css('#headerbar > div > div > div.col-xs-7.col-sm-2 > a')).click();

//         driver.sleep(3000);

//         driver.findElement(webdriver.By.css('#page-heading > h1')).getText().then(function (text) {
//             text.should.be.equal('New Task');
//         });
//     });

//     test.it('should disable create button when loaded', function(done) {
//         driver.findElement(webdriver.By.css('#create_task_button')).getAttribute('disabled').then(function (val) {
//             val.should.be.equal('true');
//         });
//     });

//     test.it('should disable create button even if we select assignee and date', function(done) {
//         var select_item = '#wrap > div.container-fluid.ng-scope > form > fieldset > div:nth-child(2) > div.col-sm-5 > select > option:nth-child(2)';
//         var date_field = '#wrap > div.container-fluid.ng-scope > form > fieldset > div:nth-child(4) > div.col-sm-5 > div > input';
//         driver.findElement(webdriver.By.css(select_item)).click();
//         driver.findElement(webdriver.By.css(date_field)).sendKeys('10-10-2020');
//         driver.findElement(webdriver.By.css('#create_task_button')).getAttribute('disabled').then(function (val) {
//             val.should.be.equal('true');
//         });
//     });

//     test.it('should enable create button when we fill in all fields', function(done) {
//         driver.findElement(webdriver.By.css('#task_description')).sendKeys('foo');
//         driver.findElement(webdriver.By.css('#create_task_button')).getAttribute('disabled').then(function (val) {
//             should.not.exist(val);
//         });
//     });

//     test.it('should disable create button again when we fill in invalid date', function(done) {
//         var date_field = '#wrap > div.container-fluid.ng-scope > form > fieldset > div:nth-child(4) > div.col-sm-5 > div > input';
//         driver.findElement(webdriver.By.css(date_field)).clear();
//         driver.findElement(webdriver.By.css(date_field)).sendKeys('10-10-2000');
//         driver.findElement(webdriver.By.css('#create_task_button')).getAttribute('disabled').then(function (val) {
//             val.should.be.equal('true');
//         });
//     });

//     test.it('should be able to post new task', function(done) {
//         var date_field = '#wrap > div.container-fluid.ng-scope > form > fieldset > div:nth-child(4) > div.col-sm-5 > div > input';
//         driver.findElement(webdriver.By.css(date_field)).clear();
//         driver.findElement(webdriver.By.css(date_field)).sendKeys('10-10-2020');
//         driver.findElement(webdriver.By.css('#create_task_button')).click();

//         driver.wait(function () {
//             return driver.isElementPresent(webdriver.By.className("alert"));
//         }, 5000);

//         driver.findElement(webdriver.By.className('alert')).getText().then(function (text) {
//             text.should.be.equal('New task added successfully. Redirecting to dashboard now...');
//         });

//         driver.sleep(2000);
//     });
// });

test.describe('Employee List Page', function() {
    test.it('should load employee list page', function(done) {
        driver.navigate().to(baseUrl);
        driver.findElement(webdriver.By.css('#sidebar > li:nth-child(5) > a')).click();
        driver.findElement(webdriver.By.css('#sidebar > li:nth-child(5) > ul > li:nth-child(2) > a')).click();

        driver.sleep(2000);

        driver.findElement(webdriver.By.css('#page-heading > h1')).getText().then(function(text) {
            text.should.be.equal('Employee List');
        });
    });

    test.it('should list admin employee information', function(done) {
        driver.findElement(webdriver.By.css('#mainGrid > div.ui-grid-render-container.ui-grid-render-container-body > div.ui-grid-viewport > div > div:nth-child(1) > div > div:nth-child(1) > div'))
            .getText().then(function(text) {
                text.should.be.equal('administrator');
            });

        driver.findElement(webdriver.By.css('#mainGrid > div.ui-grid-render-container.ui-grid-render-container-body > div.ui-grid-viewport > div > div:nth-child(1) > div > div:nth-child(2) > div'))
            .getText().then(function(text) {
                text.should.be.equal('ADMIN MASTER');
            });

        driver.findElement(webdriver.By.css('#mainGrid > div.ui-grid-render-container.ui-grid-render-container-body > div.ui-grid-viewport > div > div:nth-child(1) > div > div:nth-child(3) > div'))
            .getText().then(function(text) {
                text.should.be.equal('M');
            });
    });
    
    test.it('should load new employee page', function(done) {
        driver.findElement(webdriver.By.css('#sidebar > li:nth-child(5) > ul > li:nth-child(1) > a')).click();
        
        driver.sleep(2000);
        
        driver.findElement(webdriver.By.css('#page-heading > h1')).getText().then(function(text) {
            text.should.be.equal('Add new user');
        });
    });
});

test.after(function() {
    driver.quit();
});