require 'test_helper'

class Api::TagsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get api_tags_show_url
    assert_response :success
  end

end
