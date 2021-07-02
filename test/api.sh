#!/bin/bash
set -ex

_URL=https://localhost:1337/mailpy/api

function post {
    data=$1
    url=$2
    curl -k \
        --header "Content-Type: application/json" \
        --request POST \
        --data ${data} \
        ${_URL}/${url}
}

function get {
    url=$1
    curl -k \
        --header "Content-Type: application/json" \
        --request GET \
        ${_URL}/${url}
}

function post_group {
    post $1 group
}

function post_entry {
    post $1 entry
}

function get_entries {
    get entries
}
function get_groups {
    get groups
}
function get_conditions {
    get conditions
}
function get_entry {
    get entry?id=$1
}

get_entries
get_groups
get_conditions
get_entry "123123"
